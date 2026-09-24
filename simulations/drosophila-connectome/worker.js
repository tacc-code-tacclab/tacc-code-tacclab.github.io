/* Il modello ridotto del connettoma, in un Web Worker.
 *
 * Questo file deve riprodurre `esporta_web/modello.py` del progetto scientifico
 * entro la tolleranza dichiarata in `model/riferimento.json`. L'autotest
 * all'avvio lo verifica e rifiuta di partire se non torna: un modello che ha
 * sbagliato le equazioni non deve mai arrivare allo schermo.
 *
 *   tau * dx/dt = -x + relu(guadagno * (Wnorm @ x) + ingresso)
 *
 * Wnorm ha ogni riga divisa per la somma dei suoi |pesi|, quindi Wnorm @ x e'
 * una media pesata dei tassi presinaptici: coerente dimensionalmente e
 * contrattiva per guadagno < 1. I pesi sul disco restano quelli spediti da
 * flyverse (md5 in provenance.json); la normalizzazione e' applicata qui.
 *
 * NON e' il modello di flyverse: quello integra 167.106 neuroni con una
 * dinamica LIF a spike. Qui ci sono ~1.000 neuroni e una dinamica a tasso di
 * prim'ordine. Stessa connettivita' misurata, dinamica dichiarata e diversa.
 */

let G = null;      // grafo e stato
let P = null;      // parametri

const BASE = new URL("./model/", self.location.href);

function errore(fase, e) {
  self.postMessage({ tipo: "errore", fase, messaggio: String(e && e.message || e) });
}

async function prendi(nome, come) {
  const r = await fetch(new URL(nome, BASE), { cache: "no-cache" });
  if (!r.ok) throw new Error(`${nome}: HTTP ${r.status}`);
  return come === "json" ? r.json() : r.arrayBuffer();
}

function progresso(fase, fatto, totale) {
  self.postMessage({ tipo: "progresso", fase, fatto, totale });
}

/* ---- caricamento e validazione ------------------------------------------ */

async function carica() {
  const passi = 6;
  progresso("nodi", 0, passi);
  const nodi = await prendi("nodes.json", "json");
  progresso("archi (indptr)", 1, passi);
  const indptr = new Int32Array(await prendi("edges_indptr.bin"));
  progresso("archi (indici)", 2, passi);
  const indices = new Int32Array(await prendi("edges_indices.bin"));
  progresso("archi (pesi)", 3, passi);
  const weights = new Float32Array(await prendi("edges_weights.bin"));
  progresso("provenienza", 4, passi);
  const prov = await prendi("provenance.json", "json");
  const rif = await prendi("riferimento.json", "json");
  progresso("validazione", 5, passi);

  const n = nodi.n | 0;
  // Le stesse verifiche di Grafo._valida in Python. Un asset malformato deve
  // fermare il caricamento, non produrre numeri plausibili.
  if (indptr.length !== n + 1) throw new Error(`indptr lungo ${indptr.length}, atteso ${n + 1}`);
  if (indices.length !== weights.length) throw new Error("indices e weights di lunghezza diversa");
  if (indptr[n] !== indices.length) throw new Error("indptr[-1] non corrisponde al numero di archi");
  for (let k = 0; k < indices.length; k++) {
    const j = indices[k];
    if (j < 0 || j >= n) throw new Error(`indice di colonna fuori intervallo a ${k}: ${j}`);
    if (!Number.isFinite(weights[k])) throw new Error(`peso non finito a ${k}`);
  }
  for (const chiave of ["bodyId", "type", "side", "module", "is_sorgente", "is_bersaglio",
                        "lato_vento", "classe_jo"]) {
    if (!Array.isArray(nodi[chiave]) || nodi[chiave].length !== n) {
      throw new Error(`campo dei nodi mancante o di lunghezza sbagliata: ${chiave}`);
    }
  }

  // normalizzazione per riga, identica a Grafo.csr(normalizza=True)
  const wnorm = new Float32Array(weights.length);
  for (let i = 0; i < n; i++) {
    let somma = 0;
    for (let k = indptr[i]; k < indptr[i + 1]; k++) somma += Math.abs(weights[k]);
    const inv = 1 / Math.max(somma, 1e-9);
    for (let k = indptr[i]; k < indptr[i + 1]; k++) wnorm[k] = weights[k] * inv;
  }

  const p = rif.parametri;
  G = {
    n, nodi, indptr, indices, weights, wnorm, prov, rif,
    sorgente: Uint8Array.from(nodi.is_sorgente),
    bersaglio: Uint8Array.from(nodi.is_bersaglio),
    latoVento: Int8Array.from(nodi.lato_vento),
    classeJo: nodi.classe_jo,
    tipo: nodi.type,
    lato: nodi.side,
    vivo: new Uint8Array(n).fill(1),
    x: new Float32Array(n),
    u: new Float32Array(n),
    passo: 0,
    tettoScattato: false,
  };
  P = {
    tau_ms: p.tau_ms, dt_ms: p.dt_ms,
    jo_base_hz: p.jo_base_hz, jo_max_hz: p.jo_max_hz,
    vento_ms: p.vento_ms, velocita_piena: p.velocita_piena,
    guadagno: p.guadagno, tasso_max: p.tasso_max,
  };
  return { n, archi: indices.length, prov, rif };
}

/* ---- il modello ---------------------------------------------------------- */

/** Deflessioni antennali: la formula di flyverse.air.deflections, trascritta. */
function deflessioni(azimutVentoDeg) {
  const a = azimutVentoDeg * Math.PI / 180;
  const wx = P.vento_ms * Math.cos(a), wy = P.vento_ms * Math.sin(a);
  const c45 = Math.cos(Math.PI / 4);
  return [-(wx * c45 + wy * c45) / P.velocita_piena,
          -(wx * c45 - wy * c45) / P.velocita_piena];
}

/** Tassi dei JO: la regola di flyverse.senses.Wind.rates, trascritta. */
function calcolaIngresso(azimutVentoDeg) {
  const [dL, dR] = deflessioni(azimutVentoDeg);
  const u = G.u;
  u.fill(0);
  for (let i = 0; i < G.n; i++) {
    if (!G.sorgente[i]) continue;
    const classe = G.classeJo[i];
    if (classe !== "C" && classe !== "E") continue;
    const segno = classe === "E" ? 1 : -1;     // i C rispondono alla deflessione in avanti
    const lv = G.latoVento[i];
    const d = lv > 0 ? segno * dL : lv < 0 ? segno * dR : segno * 0.5 * (dL + dR);
    u[i] = P.jo_base_hz + P.jo_max_hz * Math.min(Math.max(d, 0), 1);
  }
  // una sorgente lesionata non inietta corrente
  for (let i = 0; i < G.n; i++) if (!G.vivo[i]) u[i] = 0;
}

/** Un passo di integrazione. Ritorna true se il tetto di sicurezza e' scattato. */
function passo() {
  const { n, indptr, indices, wnorm, x, u, vivo } = G;
  const alfa = P.dt_ms / P.tau_ms;
  const nuovo = new Float32Array(n);
  let tetto = false;
  for (let i = 0; i < n; i++) {
    if (!vivo[i]) { nuovo[i] = 0; continue; }
    let v = 0;
    for (let k = indptr[i]; k < indptr[i + 1]; k++) {
      const j = indices[k];
      if (vivo[j]) v += wnorm[k] * x[j];
    }
    v = P.guadagno * v + u[i];
    if (v < 0) v = 0;
    if (v > P.tasso_max) { tetto = true; v = P.tasso_max; }
    nuovo[i] = x[i] + alfa * (v - x[i]);
  }
  G.x = nuovo;
  G.passo += 1;
  return tetto;
}

function esegui(nPassi) {
  for (let k = 0; k < nPassi; k++) {
    if (passo()) {
      G.tettoScattato = true;
      // §3.4 del brief: nessun ripiego silenzioso. Il tetto significa che il
      // modello sta divergendo, e va detto invece di mostrare numeri finti.
      throw new Error(
        `il tetto di ${P.tasso_max} Hz e' scattato al passo ${G.passo}: il modello sta ` +
        `divergendo. Non e' un risultato.`);
    }
  }
}

function azzera() {
  G.x = new Float32Array(G.n);
  G.passo = 0;
  G.tettoScattato = false;
}

/** Tassi medi per tipo di bersaglio e lato, piu' l'asimmetria di DNa02. */
function lettura() {
  const somme = new Map(), conteggi = new Map();
  for (let i = 0; i < G.n; i++) {
    if (!G.bersaglio[i]) continue;
    const lato = G.lato[i];
    if (lato !== "L" && lato !== "R") continue;
    const chiave = `${G.tipo[i]}_${lato}`;
    somme.set(chiave, (somme.get(chiave) || 0) + G.x[i]);
    conteggi.set(chiave, (conteggi.get(chiave) || 0) + 1);
  }
  const out = {};
  for (const [k, s] of somme) out[k] = s / conteggi.get(k);
  out.DNa02_asimmetria = (out.DNa02_L || 0) - (out.DNa02_R || 0);
  return out;
}

function sommario() {
  let attivi = 0, somma = 0, max = 0;
  for (let i = 0; i < G.n; i++) {
    const v = G.x[i];
    somma += v;
    if (v > 0.5) attivi++;
    if (v > max) max = v;
  }
  let lesionati = 0;
  for (let i = 0; i < G.n; i++) if (!G.vivo[i]) lesionati++;
  return { passo: G.passo, attivi, somma, max, lesionati, lettura: lettura() };
}

/* ---- autotest contro il riferimento Python ------------------------------ */

function autotest() {
  const rif = G.rif;
  const toll = rif.tolleranza_relativa;
  const esiti = [];
  const salva = { vivo: G.vivo.slice(), x: G.x.slice(), passo: G.passo };

  const vicino = (a, b) => Math.abs(a - b) <= toll * Math.max(1, Math.abs(b));

  for (const pc of rif.punti_controllo) {
    G.vivo.fill(1);
    azzera();
    calcolaIngresso(pc.azimut_vento_deg);
    esegui(pc.passo);
    const s = sommario();
    const ok = vicino(s.somma, pc.somma_tassi) && vicino(s.max, pc.max_tasso)
            && s.attivi === pc.n_attivi;
    esiti.push({
      nome: `vento ${pc.azimut_vento_deg}°, passo ${pc.passo}`,
      ok, atteso: pc.somma_tassi, ottenuto: s.somma,
      attesiAttivi: pc.n_attivi, ottenutiAttivi: s.attivi,
    });
  }

  const l = rif.lesione;
  G.vivo.fill(1);
  for (let i = 0; i < G.n; i++) if (G.tipo[i] === l.tipo_rimosso) G.vivo[i] = 0;
  azzera();
  calcolaIngresso(l.azimut_vento_deg);
  esegui(l.passo);
  const sl = sommario();
  esiti.push({
    nome: `lesione ${l.tipo_rimosso}`, ok: vicino(sl.somma, l.somma_tassi),
    atteso: l.somma_tassi, ottenuto: sl.somma,
  });

  G.vivo.set(salva.vivo); G.x.set(salva.x); G.passo = salva.passo;
  return { esiti, superato: esiti.every((e) => e.ok), tolleranza: toll };
}

/** I `quanti` archi di peso |w| maggiore, come terne [post, pre, segno].
 *  Disegnarli tutti e 58.753 coprirebbe la tela di un velo uniforme; il segno
 *  e' un dato misurato (modello dei recettori), non una scelta grafica. */
function archiPiuForti(quanti) {
  const { n, indptr, indices, weights } = G;
  const tutti = new Int32Array(weights.length);
  for (let k = 0; k < weights.length; k++) tutti[k] = k;
  const ordinati = Array.from(tutti).sort((a, b) => Math.abs(weights[b]) - Math.abs(weights[a]));
  const presi = ordinati.slice(0, Math.min(quanti, ordinati.length));
  // per ogni arco serve la riga (post): ricerca binaria su indptr
  const riga = (k) => {
    let lo = 0, hi = n;
    while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (indptr[mid] <= k) lo = mid; else hi = mid; }
    return lo;
  };
  return presi.map((k) => [riga(k), indices[k], weights[k] >= 0 ? 1 : -1]);
}

/* ---- protocollo dei messaggi -------------------------------------------- */

self.onmessage = async (ev) => {
  const m = ev.data || {};
  try {
    if (m.tipo !== "carica" && G === null) {
      // non dovrebbe succedere: l'interfaccia resta nascosta finche' il primo
      // stato non arriva. Se succede si dice, invece di leggere da null.
      throw new Error("il modello non e' ancora caricato");
    }
    switch (m.tipo) {
      case "carica": {
        const info = await carica();
        const test = autotest();
        azzera();
        self.postMessage({ tipo: "pronto", info, test, parametri: P });
        break;
      }
      case "ingresso":
        calcolaIngresso(m.azimut);
        self.postMessage({ tipo: "stato", sommario: sommario() });
        break;
      case "avanza":
        esegui(m.passi | 0);
        self.postMessage({ tipo: "stato", sommario: sommario(), tassi: G.x });
        break;
      case "lesiona": {
        // m.indici = array di indici di nodo da rimuovere; m.attiva = true/false
        for (const i of m.indici) if (i >= 0 && i < G.n) G.vivo[i] = m.attiva ? 0 : 1;
        calcolaIngresso(m.azimut);
        self.postMessage({ tipo: "lesione", lesionati: Array.from(G.vivo).reduce((a, v) => a + (v ? 0 : 1), 0) });
        break;
      }
      case "azzera_lesioni":
        G.vivo.fill(1);
        calcolaIngresso(m.azimut);
        self.postMessage({ tipo: "lesione", lesionati: 0 });
        break;
      case "azzera":
        azzera();
        calcolaIngresso(m.azimut);
        self.postMessage({ tipo: "stato", sommario: sommario(), tassi: G.x });
        break;
      case "confronto": {
        // corsa appaiata: stesse condizioni, una intatta e una lesionata
        const salva = G.vivo.slice();
        const risultati = {};
        for (const arm of ["intatto", "lesionato"]) {
          if (arm === "intatto") G.vivo.fill(1); else G.vivo.set(salva);
          azzera();
          calcolaIngresso(m.azimut);
          esegui(m.passi | 0);
          risultati[arm] = sommario();
        }
        G.vivo.set(salva);
        azzera();
        calcolaIngresso(m.azimut);
        self.postMessage({ tipo: "confronto", risultati, azimut: m.azimut, passi: m.passi | 0 });
        break;
      }
      case "nodi":
        self.postMessage({ tipo: "nodi", nodi: G.nodi, provenienza: G.prov,
                           archi: archiPiuForti(m.quanti | 0 || 1800) });
        break;
      default:
        throw new Error(`messaggio sconosciuto: ${m.tipo}`);
    }
  } catch (e) {
    errore(m.tipo || "sconosciuto", e);
  }
};
