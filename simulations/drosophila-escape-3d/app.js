/* Riproduce le corse registrate e disegna le tracce sincronizzate.
 *
 * Non c'e' simulazione qui: la simulazione e' girata su una H200 a 22x piu'
 * lento del reale e non puo' stare in un browser. Questa pagina riproduce i
 * fotogrammi e i numeri prodotti da quella corsa, senza toccarli.
 */

const $ = (id) => document.getElementById(id);
const video = $("video");
const tela = $("grafico");
const ctx = tela.getContext("2d");

const SOGLIA_HZ = 33;               // il criterio del gate di riferimento
const ORDINE = ["intatto", "LC4", "LPLC2", "casuale appaiato"];
const ETICHETTE = {
  "intatto": "Intact",
  "LC4": "LC4 removed",
  "LPLC2": "LPLC2 removed",
  "casuale appaiato": "311 at random",
};

let M = null;          // il manifesto
let corrente = "intatto";
let tMax = 1;

/* ---- tema, come il resto del sito --------------------------------------- */
const radice = document.documentElement;
try {
  const s = localStorage.getItem("theme");
  if (s) radice.dataset.theme = s;
  else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) radice.dataset.theme = "dark";
} catch { /* localStorage puo' essere bloccato */ }
document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const p = radice.dataset.theme === "dark" ? "light" : "dark";
  radice.dataset.theme = p;
  try { localStorage.setItem("theme", p); } catch { /* ignorato */ }
  disegna();
});

function colori() {
  const s = getComputedStyle(radice);
  const g = (n, f) => (s.getPropertyValue(n) || f).trim();
  return {
    linea: g("--line", "#ced4cf"),
    testo: g("--muted", "#586260"),
    inchiostro: g("--ink", "#111b1a"),
    accento: g("--accent", "#007f73"),
    fondo: g("--surface-alt", "#eaece7"),
    allarme: "#b4472a",
  };
}

/* ---- grafico ------------------------------------------------------------- */
function disegna() {
  if (!M) return;
  const c = colori();
  const L = tela.width, H = tela.height;
  const ml = 52, mr = 14, mt = 16, mb = 30;
  const w = L - ml - mr, h = H - mt - mb;
  ctx.clearRect(0, 0, L, H);
  ctx.fillStyle = c.fondo; ctx.fillRect(0, 0, L, H);

  let yMax = 10;
  for (const a of ORDINE) for (const p of M.bracci[a].traccia) if (p.gf > yMax) yMax = p.gf;
  yMax = Math.ceil(yMax / 20) * 20;

  const X = (t) => ml + (t / tMax) * w;
  const Y = (v) => mt + h - (v / yMax) * h;

  // assi e griglia
  ctx.strokeStyle = c.linea; ctx.lineWidth = 1;
  ctx.fillStyle = c.testo;
  ctx.font = "11px ui-monospace, Menlo, Consolas, monospace";
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (let v = 0; v <= yMax; v += 20) {
    ctx.beginPath(); ctx.moveTo(ml, Y(v)); ctx.lineTo(L - mr, Y(v)); ctx.stroke();
    ctx.fillText(String(v), ml - 8, Y(v));
  }
  ctx.save(); ctx.translate(14, mt + h / 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center"; ctx.fillText("DNp01  Hz", 0, 0); ctx.restore();
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (let t = 0; t <= tMax + 1e-6; t += 0.4) {
    ctx.fillText(`${t.toFixed(1)}s`, X(t), mt + h + 7);
  }

  // la soglia dichiarata
  ctx.save();
  ctx.setLineDash([5, 4]); ctx.strokeStyle = c.allarme; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(ml, Y(SOGLIA_HZ)); ctx.lineTo(L - mr, Y(SOGLIA_HZ)); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = c.allarme; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
  ctx.fillText(`${SOGLIA_HZ} Hz criterion`, ml + 6, Y(SOGLIA_HZ) - 3);

  // l'istante in cui la palla parte
  const tPartenza = (M.protocollo.cammino_passi * M.protocollo.dt_ms) / 1000;
  ctx.strokeStyle = c.linea; ctx.setLineDash([2, 3]);
  ctx.beginPath(); ctx.moveTo(X(tPartenza), mt); ctx.lineTo(X(tPartenza), mt + h); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = c.testo; ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText("ball starts", X(tPartenza) + 4, mt + 2);

  // le tracce: quella scelta in evidenza, le altre sfumate se richiesto
  const fantasmi = $("ghost").checked;
  const traccia = (nome, forte) => {
    const t = M.bracci[nome].traccia;
    ctx.beginPath();
    t.forEach((p, i) => (i ? ctx.lineTo(X(p.t), Y(p.gf)) : ctx.moveTo(X(p.t), Y(p.gf))));
    ctx.strokeStyle = forte ? c.accento : c.testo;
    ctx.globalAlpha = forte ? 1 : 0.22;
    ctx.lineWidth = forte ? 2.2 : 1.1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  if (fantasmi) for (const a of ORDINE) if (a !== corrente) traccia(a, false);
  traccia(corrente, true);

  // il cursore di riproduzione, in tempo SIMULATO
  const t = Number.isFinite(video.currentTime) ? tempoSim(video.currentTime) : 0;
  if (t > 0) {
    ctx.strokeStyle = c.inchiostro; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X(t), mt); ctx.lineTo(X(t), mt + h); ctx.stroke();
  }
}

/* ---- lettura sincronizzata ---------------------------------------------- */

/** Il tempo del VIDEO non e' il tempo della SIMULAZIONE: ogni fotogramma vale
 *  10 ms simulati ma viene riprodotto a 25 fps, quindi il video scorre a 0.25x.
 *  Confondere i due faceva leggere 0 Hz nel momento del picco. */
function tempoSim(tVideo) {
  const p = M.protocollo;
  return Math.round(tVideo * p.fps) * (p.dt_ms / 1000);
}

function puntoA(tVideo) {
  const tr = M.bracci[corrente].traccia;
  const i = Math.round(tempoSim(tVideo) / (M.protocollo.dt_ms / 1000));
  return tr[Math.max(0, Math.min(tr.length - 1, i))];
}

function aggiorna() {
  if (!M) return;
  const p = puntoA(video.currentTime || 0);
  const b = M.bracci[corrente];
  $("sovrimpressione").textContent =
    `${ETICHETTE[corrente]}\n` +
    `ball  ${String(p.dist).padStart(5)} mm\n` +
    `DNp01 ${p.gf.toFixed(1).padStart(5)} Hz\n` +
    `LPLC2 ${p.lplc2.toFixed(1).padStart(5)} Hz`;
  const caldo = p.gf >= SOGLIA_HZ;
  $("lettura").innerHTML =
    `<div><span class="k">condition</span><span class="v">${ETICHETTE[corrente]}</span></div>` +
    `<div><span class="k">neurons removed</span><span class="v">${b.n_spenti.toLocaleString("en")}</span></div>` +
    `<div><span class="k">giant fibre now</span><span class="v ${caldo ? "hot" : ""}">${p.gf.toFixed(1)} Hz</span></div>` +
    `<div><span class="k">peak this run</span><span class="v ${b.picco_gf_hz >= SOGLIA_HZ ? "hot" : ""}">${b.picco_gf_hz.toFixed(1)} Hz</span></div>` +
    `<div><span class="k">cells firing</span><span class="v">${p.attivi.toLocaleString("en")}</span></div>` +
    `<div><span class="k">walking speed</span><span class="v">${p.v.toFixed(1)} mm/s</span></div>`;
  disegna();
}

/* ---- bracci --------------------------------------------------------------- */
function scegli(nome, riparti = true) {
  corrente = nome;
  for (const b of document.querySelectorAll(".e3-arm")) {
    b.setAttribute("aria-checked", String(b.dataset.arm === nome));
  }
  const t = video.currentTime;
  const inCorso = !video.paused;
  video.src = `media/${M.bracci[nome].video}`;
  video.load();
  video.addEventListener("loadeddata", () => {
    // stesso istante nella nuova condizione: il confronto resta appaiato
    video.currentTime = riparti ? 0 : Math.min(t, video.duration || 0);
    if (inCorso) video.play().catch(() => {});
    aggiorna();
  }, { once: true });
}

for (const b of document.querySelectorAll(".e3-arm")) {
  b.addEventListener("click", () => scegli(b.dataset.arm, false));
}
$("play").addEventListener("click", () => {
  if (video.paused) { video.play().catch(() => {}); } else { video.pause(); }
});
$("restart").addEventListener("click", () => { video.currentTime = 0; video.play().catch(() => {}); });
$("ghost").addEventListener("change", disegna);
// `timeupdate` non scatta se si scorre a video fermo: senza `seeked` i numeri
// restavano a quelli dell'istante zero mentre l'immagine era gia' altrove.
for (const ev of ["timeupdate", "seeked", "loadedmetadata", "loadeddata"]) {
  video.addEventListener(ev, aggiorna);
}
video.addEventListener("play", () => { $("play").textContent = "Pause"; });
video.addEventListener("pause", () => { $("play").textContent = "Play"; });
video.addEventListener("ended", () => { $("play").textContent = "Play"; });
window.addEventListener("resize", disegna);

/* ---- provenienza ---------------------------------------------------------- */
function direzione(gradi) {
  const a = ((gradi % 360) + 360) % 360;
  if (a < 20 || a > 340) return "head-on";
  if (a > 160 && a < 200) return "from behind";
  return `from ${gradi}°`;
}

function provenienza() {
  const p = M.protocollo;
  const voci = [
    ["connectome", `MaleCNS v1.0 · ${M.neuroni_totali.toLocaleString("en")} neurons`],
    ["neural model", "flyverse-core, spiking LIF with its receptor model — no training, no fitting"],
    ["vision", "1,466 retinal columns · 7 rays each over a 4.5° acceptance angle · cast into the MuJoCo scene"],
    ["body", "NeuroMechFly in MuJoCo · six legs, adhesion, solver-resolved contacts"],
    ["stimulus", `${p.raggio_palla_mm} mm sphere · ${p.velocita_mm_s / 1000} m/s · ${direzione(p.azimut_deg)} · stops at ${p.arresto_mm} mm · path fixed in the world`],
    ["jump", `${(p.salto_mm_s ?? 600) / 1000} m/s at 45° above the horizon — a motor readout, measured to land the fly on its feet`],
    ["timing", `${p.dt_ms} ms control step · ${p.cammino_passi} steps walking first · ${p.tenuta_passi} steps held`],
    ["conditions", "identical starting state; only the lesion differs"],
    ["determinism", "synaptic depression off, so a repeat of a condition is identical"],
    ["speed", `22× slower than real time on one H200 — recorded, then replayed at ${(p.fps * p.dt_ms / 1000).toFixed(2)}× speed`],
    ["licence", "MaleCNS v1.0 CC BY 4.0 · flyverse-core MIT"],
  ];
  const dl = $("prov");
  for (const [k, v] of voci) {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = v;
    dl.append(dt, dd);
  }
}

/* ---- avvio ---------------------------------------------------------------- */
fetch("media/manifesto.json", { cache: "no-cache" })
  .then((r) => { if (!r.ok) throw new Error(`manifesto: HTTP ${r.status}`); return r.json(); })
  .then((m) => {
    M = m;
    const tr = M.bracci["intatto"].traccia;
    tMax = tr[tr.length - 1].t;
    provenienza();
    scegli("intatto");
    disegna();
  })
  .catch((e) => {
    $("sovrimpressione").textContent = `the recording did not load — ${e.message}`;
    $("lettura").textContent = "Nothing is shown in its place: an animation without its numbers would look like a result.";
  });
