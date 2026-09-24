/* Orchestrazione dell'interfaccia. Il calcolo sta tutto nel worker: qui si
 * disegna, si raccolgono i comandi e si mostra la provenienza.
 *
 * Il worker rifiuta di dichiararsi pronto se l'autotest contro il riferimento
 * Python non passa, quindi tutto cio' che segue gira solo su un modello
 * verificato. Se fallisce, si mostra l'errore e non si disegna nulla: una
 * finta animazione sarebbe indistinguibile da un risultato.
 */

const $ = (id) => document.getElementById(id);
const tela = $("tela");
const ctx = tela.getContext("2d", { alpha: false });

let worker = null;
let NODI = null;
let POS = null;            // {x, y} per nodo, in coordinate della tela
let TASSI = null;          // Float32Array dei tassi correnti
let LESIONATI = null;      // Uint8Array
let inEsecuzione = false;
let animazione = null;
let parametri = null;
let nodoSotto = -1;
//: l'interfaccia resta nascosta finche' il primo stato non e' arrivato. Senza,
//: si possono premere i comandi mentre l'azzeramento iniziale e' ancora in
//: viaggio verso il worker, e quei passi vengono poi cancellati: misurato, due
//: click su sessanta andavano persi.
let pronta = false;

const PASSI_CONFRONTO = 150;
const PASSI_PER_FOTOGRAMMA = 2;

/* ---- tema: stesso comportamento del resto del sito ---------------------- */
const radice = document.documentElement;
try {
  const salvato = localStorage.getItem("theme");
  if (salvato) radice.dataset.theme = salvato;
  else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) radice.dataset.theme = "dark";
} catch { /* localStorage puo' essere bloccato: il tema chiaro resta valido */ }
document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const prossimo = radice.dataset.theme === "dark" ? "light" : "dark";
  radice.dataset.theme = prossimo;
  try { localStorage.setItem("theme", prossimo); } catch { /* ignorato */ }
  disegna();
});

/* ---- colori presi dal tema corrente ------------------------------------- */
function colori() {
  const s = getComputedStyle(document.documentElement);
  const leggi = (nome, fallback) => (s.getPropertyValue(nome) || fallback).trim();
  return {
    fondo: leggi("--surface-alt", "#eaece7"),
    linea: leggi("--line", "#ced4cf"),
    testo: leggi("--muted", "#586260"),
    accento: leggi("--accent", "#007f73"),
    caldo: leggi("--warm", "#d6ff5f"),
    sorgente: "#3aa0d8",
    intermedio: "#8a93a8",
    lesione: "#b4472a",
    eccitatorio: "#3aa0d8",
    inibitorio: "#b4472a",
  };
}

/* ---- disposizione dei nodi: a strati, e i lati separati ----------------- */
let ARCHI = null;                // campione degli archi piu' forti, dal worker

function calcolaPosizioni(nodi) {
  const n = nodi.n;
  const L = tela.width, H = tela.height;
  const alto = 34, basso = H - 18;
  const pos = { x: new Float32Array(n), y: new Float32Array(n) };

  // Le tre colonne SONO i salti della riduzione: sorgenti, interneuroni,
  // discendenti. Le sorgenti si dividono per lato funzionale, che e' la
  // variabile che tutto l'esperimento manipola: vederla separata e' informazione.
  const sxSorg = [], dxSorg = [], mezzo = [], dn = [];
  for (let i = 0; i < n; i++) {
    if (nodi.is_sorgente[i]) (nodi.lato_vento[i] > 0 ? sxSorg : dxSorg).push(i);
    else if (nodi.is_bersaglio[i]) dn.push(i);
    else mezzo.push(i);
  }
  const perTipo = (a, b) => {
    const ta = nodi.type[a] || "", tb = nodi.type[b] || "";
    return ta !== tb ? (ta < tb ? -1 : 1) : nodi.bodyId[a] - nodi.bodyId[b];
  };
  [sxSorg, dxSorg, mezzo, dn].forEach((g) => g.sort(perTipo));

  // sorgenti: due colonne affiancate, una per lato funzionale
  const colonnaSorgenti = (gruppo, x) => {
    const passo = (basso - alto) / Math.max(1, gruppo.length - 1);
    gruppo.forEach((i, k) => {
      pos.x[i] = x + (k % 2 ? 7 : 0);          // zigzag: separa i sovrapposti
      pos.y[i] = alto + k * passo;
    });
  };
  colonnaSorgenti(sxSorg, 60);
  colonnaSorgenti(dxSorg, 96);

  // interneuroni: griglia al centro
  const colonne = Math.max(1, Math.round(Math.sqrt(mezzo.length * 1.8)));
  const righe = Math.ceil(mezzo.length / colonne);
  const x0 = 170, x1 = L - 250;
  mezzo.forEach((i, k) => {
    const c = k % colonne, r = (k / colonne) | 0;
    pos.x[i] = x0 + (colonne === 1 ? 0 : (c * (x1 - x0)) / (colonne - 1));
    pos.y[i] = alto + (righe === 1 ? (basso - alto) / 2 : (r * (basso - alto)) / (righe - 1));
  });

  // discendenti: raggruppati per tipo, spaziati generosamente, etichetta unica
  const gruppi = new Map();
  for (const i of dn) {
    const chiave = nodi.type[i] || "(untyped)";
    if (!gruppi.has(chiave)) gruppi.set(chiave, []);
    gruppi.get(chiave).push(i);
  }
  const chiavi = [...gruppi.keys()].sort();
  const passoG = (basso - alto) / Math.max(1, chiavi.length);
  ETICHETTE_DN = [];
  chiavi.forEach((chiave, g) => {
    const membri = gruppi.get(chiave);
    const yc = alto + passoG * (g + 0.5);
    membri.forEach((i, k) => {
      const lato = nodi.side[i];
      pos.x[i] = L - 150 + (lato === "R" ? 22 : lato === "L" ? 0 : 11);
      pos.y[i] = yc + (k - (membri.length - 1) / 2) * 3;
    });
    ETICHETTE_DN.push({ testo: chiave, x: L - 118, y: yc });
  });

  return pos;
}

let ETICHETTE_DN = [];
/* ---- disegno ------------------------------------------------------------ */
function disegna() {
  if (!NODI || !POS) return;
  const c = colori();
  const L = tela.width, H = tela.height;
  ctx.fillStyle = c.fondo;
  ctx.fillRect(0, 0, L, H);

  // archi: un campione fisso dei piu' forti, con il segno del peso. Il segno e'
  // un dato misurato (modello dei recettori), non una scelta grafica.
  if (ARCHI) {
    ctx.lineWidth = 0.5;
    for (const [a, b, segno] of ARCHI) {
      if (LESIONATI[a] || LESIONATI[b]) continue;
      ctx.strokeStyle = segno > 0 ? c.eccitatorio : c.inibitorio;
      ctx.globalAlpha = 0.11;
      ctx.beginPath();
      ctx.moveTo(POS.x[b], POS.y[b]);
      ctx.lineTo(POS.x[a], POS.y[a]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // intestazioni delle colonne: dicono cosa sono
  ctx.fillStyle = c.testo;
  ctx.font = "11px ui-monospace, Menlo, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.fillText("Johnston's organ", 82, 13);
  ctx.fillText("L    R", 82, 26);
  ctx.fillText("interneurons", (170 + L - 250) / 2, 20);
  ctx.fillText("descending", L - 118, 20);

  // scala della luminosita': radice quadrata, altrimenti con un picco a 40 Hz
  // le centinaia di cellule sotto 1 Hz risultano invisibili
  let massimo = 1;
  if (TASSI) for (let i = 0; i < TASSI.length; i++) if (TASSI[i] > massimo) massimo = TASSI[i];

  for (let i = 0; i < NODI.n; i++) {
    const tasso = TASSI ? TASSI[i] : 0;
    const q = Math.sqrt(Math.min(1, tasso / massimo));
    const bersaglio = NODI.is_bersaglio[i];
    const sorgente = NODI.is_sorgente[i];
    const r = bersaglio ? 4.5 : sorgente ? 2.6 : 2.2;

    if (LESIONATI[i]) {
      ctx.beginPath();
      ctx.arc(POS.x[i], POS.y[i], r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = c.lesione;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(POS.x[i] - r, POS.y[i] - r); ctx.lineTo(POS.x[i] + r, POS.y[i] + r);
      ctx.moveTo(POS.x[i] + r, POS.y[i] - r); ctx.lineTo(POS.x[i] - r, POS.y[i] + r);
      ctx.stroke();
      continue;
    }
    // spento -> tinta smorzata della colonna; acceso -> colore pieno
    const base = bersaglio ? c.caldo : sorgente ? c.sorgente : c.intermedio;
    ctx.globalAlpha = 0.18 + 0.82 * q;
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(POS.x[i], POS.y[i], r + (bersaglio ? q * 2 : q), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // un'etichetta per tipo di discendente, non una per cellula
  ctx.textAlign = "left";
  ctx.fillStyle = c.testo;
  ctx.font = "11px ui-monospace, Menlo, Consolas, monospace";
  for (const e of ETICHETTE_DN) ctx.fillText(e.testo, e.x, e.y + 4);

  if (nodoSotto >= 0) {
    ctx.strokeStyle = c.accento;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(POS.x[nodoSotto], POS.y[nodoSotto], 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function nodoVicino(px, py) {
  let migliore = -1, distanza = 14 * 14;
  for (let i = 0; i < NODI.n; i++) {
    const dx = POS.x[i] - px, dy = POS.y[i] - py;
    const d = dx * dx + dy * dy;
    if (d < distanza) { distanza = d; migliore = i; }
  }
  return migliore;
}

function coordinate(ev) {
  const r = tela.getBoundingClientRect();
  const t = ev.touches?.[0] || ev.changedTouches?.[0] || ev;
  return [((t.clientX - r.left) / r.width) * tela.width,
          ((t.clientY - r.top) / r.height) * tela.height];
}

/* ---- comunicazione col worker ------------------------------------------- */
function invia(m) { worker.postMessage(m); }
const azimut = () => Number($("vento").value);

function mostraErrore(testo) {
  fermare();
  $("caricamento").hidden = true;
  $("app").hidden = true;
  $("errore").hidden = false;
  $("errore-testo").textContent = testo;
}

function aggiornaLettura(lettura) {
  const cont = $("lettura");
  cont.innerHTML = "";
  const chiavi = Object.keys(lettura).filter((k) => k !== "DNa02_asimmetria").sort();
  for (const k of chiavi) {
    const a = document.createElement("div"); a.className = "r-nome"; a.textContent = etichetta(k);
    const b = document.createElement("div"); b.className = "r-val"; b.textContent = lettura[k].toFixed(3) + " Hz";
    cont.append(a, b);
  }
  const riga = document.createElement("div");
  riga.className = "r-chiave";
  const v = lettura.DNa02_asimmetria ?? 0;
  riga.textContent = `DNa02 asymmetry (L − R): ${v >= 0 ? "+" : ""}${v.toFixed(4)} Hz`;
  cont.append(riga);
}

function aggiornaStato(s) {
  $("stato-tela").textContent =
    `step ${s.passo} · ${s.attivi} of ${NODI.n} cells above 0.5 Hz · peak ${s.max.toFixed(1)} Hz` +
    (s.lesionati ? ` · ${s.lesionati} lesioned` : "");
  aggiornaLettura(s.lettura);
}

/* ---- ciclo di animazione ------------------------------------------------ */
function partire() {
  if (inEsecuzione) return;
  inEsecuzione = true;
  $("avvia").textContent = "Pause";
  const giro = () => {
    if (!inEsecuzione) return;
    invia({ tipo: "avanza", passi: PASSI_PER_FOTOGRAMMA });
    animazione = requestAnimationFrame(giro);
  };
  animazione = requestAnimationFrame(giro);
}
function fermare() {
  inEsecuzione = false;
  if (animazione) cancelAnimationFrame(animazione);
  animazione = null;
  const b = $("avvia");
  if (b) b.textContent = "Run";
}

/* ---- avvio -------------------------------------------------------------- */
function avviaWorker() {
  pronta = false;
  $("errore").hidden = true;
  $("caricamento").hidden = false;
  $("app").hidden = true;
  worker?.terminate();
  worker = new Worker("worker.js", { type: "classic" });
  worker.onerror = (e) => mostraErrore(`worker: ${e.message || "failed to start"}`);
  worker.onmessage = (ev) => {
    const m = ev.data;
    switch (m.tipo) {
      case "progresso": {
        $("barra").style.width = `${Math.round((m.fatto / m.totale) * 100)}%`;
        $("fase").textContent = `loading ${m.fase}…`;
        break;
      }
      case "errore":
        mostraErrore(`${m.fase}: ${m.messaggio}`);
        break;
      case "pronto": {
        parametri = m.parametri;
        if (!m.test.superato) {
          const falliti = m.test.esiti.filter((e) => !e.ok)
            .map((e) => `${e.nome}: expected ${e.atteso}, got ${e.ottenuto}`).join("; ");
          mostraErrore(`the model failed its self-test against the Python reference — ${falliti}`);
          return;
        }
        $("fase").textContent = `self-test passed (${m.test.esiti.length} checkpoints, relative tolerance ${m.test.tolleranza})`;
        invia({ tipo: "nodi" });
        break;
      }
      case "nodi": {
        NODI = m.nodi;
        ARCHI = m.archi || null;
        LESIONATI = new Uint8Array(NODI.n);
        POS = calcolaPosizioni(NODI);
        riempiGruppi();
        mostraProvenienza(m.provenienza);
        $("sub-circuito").textContent =
          `${NODI.n.toLocaleString("en")} neurons · ${m.provenienza.esportato.n_archi.toLocaleString("en")} connections · ` +
          `MaleCNS ${m.provenienza.connettoma.release} · reduction: ${m.provenienza.riduzione.max_hops} hops, sources → descending`;
        invia({ tipo: "azzera", azimut: azimut() });
        break;
      }
      case "stato":
        if (m.tassi) TASSI = m.tassi;
        aggiornaStato(m.sommario);
        disegna();
        if (!pronta) {
          pronta = true;
          $("caricamento").hidden = true;
          $("app").hidden = false;
          $("provenienza").hidden = false;
        }
        break;
      case "lesione": {
        $("stato-lesione").textContent = m.lesionati
          ? `${m.lesionati} neurons removed from the computation`
          : "no lesion";
        invia({ tipo: "azzera", azimut: azimut() });
        break;
      }
      case "confronto":
        mostraConfronto(m);
        break;
    }
  };
  invia({ tipo: "carica" });
}

/* ---- gruppi lesionabili: solo popolazioni reali -------------------------- */
function riempiGruppi() {
  const sel = $("gruppo");
  const conteggio = new Map();
  for (let i = 0; i < NODI.n; i++) {
    const t = NODI.type[i] || "(untyped)";
    conteggio.set(t, (conteggio.get(t) || 0) + 1);
  }
  const voci = [...conteggio.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  sel.innerHTML = "";
  // i bersagli in cima: sono quelli che interessa lesionare
  const bersagli = new Set();
  for (let i = 0; i < NODI.n; i++) if (NODI.is_bersaglio[i]) bersagli.add(NODI.type[i]);
  const ordinate = [...voci].sort((a, b) => (bersagli.has(b[0]) ? 1 : 0) - (bersagli.has(a[0]) ? 1 : 0));
  for (const [tipo, n] of ordinate) {
    const o = document.createElement("option");
    o.value = tipo;
    o.textContent = `${tipo} — ${n} cell${n === 1 ? "" : "s"}${bersagli.has(tipo) ? " (descending)" : ""}`;
    sel.append(o);
  }
}

function indiciDelGruppo(tipo) {
  const out = [];
  for (let i = 0; i < NODI.n; i++) if ((NODI.type[i] || "(untyped)") === tipo) out.push(i);
  return out;
}

/* ---- confronto appaiato -------------------------------------------------- */
/** La chiave interna resta quella del riferimento Python, cosi' i due restano
 *  confrontabili; qui si traduce solo per la lettura. */
function etichetta(chiave) {
  return chiave === "DNa02_asimmetria" ? "DNa02 asymmetry (L − R)" : chiave;
}

function mostraConfronto(m) {
  const box = $("tabella-confronto");
  const a = m.risultati.intatto, b = m.risultati.lesionato;
  const chiavi = [...new Set([...Object.keys(a.lettura), ...Object.keys(b.lettura)])].sort();
  const righe = [
    ["cells above 0.5 Hz", a.attivi, b.attivi],   // interi: il formattatore li tiene tali
    ["summed rate (Hz)", a.somma, b.somma],
    ["peak rate (Hz)", a.max, b.max],
    ...chiavi.map((k) => [k, a.lettura[k] ?? 0, b.lettura[k] ?? 0]),
  ];
  const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(4));
  const fmtD = (v) => (Number.isInteger(v) ? (v >= 0 ? "+" : "") + v : (v >= 0 ? "+" : "") + v.toFixed(4));
  box.innerHTML =
    `<table><caption class="sim-mono sim-caption">wind ${m.azimut}° · ${m.passi} steps · ` +
    `identical initial state, input and numerics in both arms</caption>` +
    `<thead><tr><th>measure</th><th>intact</th><th>lesioned</th><th>Δ</th></tr></thead><tbody>` +
    righe.map(([k, x, y]) => {
      const d = y - x;
      const diverso = Math.abs(d) > 1e-6;
      return `<tr><td>${etichetta(k)}</td><td>${fmt(x)}</td><td>${fmt(y)}</td>` +
             `<td class="${diverso ? "diff-si" : ""}">${diverso ? fmtD(d) : "—"}</td></tr>`;
    }).join("") +
    `</tbody></table>`;
  box.hidden = false;
}

/* ---- provenienza --------------------------------------------------------- */
function mostraProvenienza(p) {
  const voci = [
    ["dataset", `${p.connettoma.dataset} ${p.connettoma.release}`],
    ["connectome md5", p.connettoma.impronta_md5],
    ["shipped weights md5", p.connettoma.md5_pesi_spediti],
    ["full graph", `${p.connettoma.n_neuroni_totali.toLocaleString("en")} neurons, ${p.connettoma.n_archi_totali.toLocaleString("en")} connections`],
    ["deployed here", `${p.esportato.n_neuroni.toLocaleString("en")} neurons, ${p.esportato.n_archi.toLocaleString("en")} connections`],
    ["reduction", p.riduzione.metodo],
    ["sources", `${p.riduzione.sorgenti_regex} (${p.riduzione.sorgenti_n} cells)`],
    ["targets", p.riduzione.bersagli_tipi.join(", ")],
    ["laterality", p.riduzione.lateralita_metodo],
    ["inhibitory fraction", (100 * p.esportato.frazione_inibitoria).toFixed(1) + " %"],
    ["source commit", p.sorgente.commit.slice(0, 12) + (p.sorgente.albero_pulito ? " (clean tree)" : " (dirty tree)")],
    ["exported", p.generato_utc],
    ["dynamics", `rate model, tau ${parametri.tau_ms} ms, dt ${parametri.dt_ms} ms, recurrent gain ${parametri.guadagno}`],
    ["licence", p.licenza],
  ];
  // i valori vengono dal nostro provenance.json, ma si inseriscono come testo
  // e non come HTML: nessun percorso di iniezione, anche se il file cambiasse
  const dl = document.createElement("dl");
  dl.className = "sim-prov";
  dl.id = "prov-tabella";
  for (const [k, v] of voci) {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = String(v);
    dl.append(dt, dd);
  }
  $("prov-tabella").replaceWith(dl);
}

/* ---- comandi ------------------------------------------------------------- */
$("vento").addEventListener("input", (e) => {
  $("vento-val").textContent = `${e.target.value}°`;
  invia({ tipo: "azzera", azimut: azimut() });
});
$("avvia").addEventListener("click", () => (inEsecuzione ? fermare() : partire()));
$("passo").addEventListener("click", () => { fermare(); invia({ tipo: "avanza", passi: 1 }); });
$("riavvia").addEventListener("click", () => { fermare(); invia({ tipo: "azzera", azimut: azimut() }); });
$("lesiona").addEventListener("click", () => {
  const indici = indiciDelGruppo($("gruppo").value);
  for (const i of indici) LESIONATI[i] = 1;
  fermare();
  invia({ tipo: "lesiona", indici, attiva: true, azimut: azimut() });
});
$("ripristina").addEventListener("click", () => {
  LESIONATI.fill(0);
  fermare();
  invia({ tipo: "azzera_lesioni", azimut: azimut() });
  $("tabella-confronto").hidden = true;
});
$("confronta").addEventListener("click", () => {
  fermare();
  invia({ tipo: "confronto", azimut: azimut(), passi: PASSI_CONFRONTO });
});
$("riprova").addEventListener("click", avviaWorker);

tela.addEventListener("pointermove", (ev) => {
  if (!NODI) return;
  const [x, y] = coordinate(ev);
  const i = nodoVicino(x, y);
  if (i !== nodoSotto) {
    nodoSotto = i;
    tela.title = i >= 0
      ? `${NODI.type[i] || "(untyped)"}${NODI.side[i] === "L" || NODI.side[i] === "R" ? " " + NODI.side[i] : ""} · body ${NODI.bodyId[i]} · ${TASSI ? TASSI[i].toFixed(2) : "0.00"} Hz · click to toggle`
      : "";
    disegna();
  }
});
tela.addEventListener("pointerleave", () => { nodoSotto = -1; disegna(); });
tela.addEventListener("click", (ev) => {
  if (!NODI) return;
  const [x, y] = coordinate(ev);
  const i = nodoVicino(x, y);
  if (i < 0) return;
  LESIONATI[i] = LESIONATI[i] ? 0 : 1;
  fermare();
  invia({ tipo: "lesiona", indici: [i], attiva: !!LESIONATI[i], azimut: azimut() });
});

window.addEventListener("resize", () => disegna());

avviaWorker();
