/* Versione 2: l'esito e' sopravvivere o no.
   Nessun pixel inventato sul video. Il verdetto e' una lettura del grafico
   della distanza, che e' la figura scientifica della pagina. */

const $ = (id) => document.getElementById(id);
const radice = document.documentElement;
try {
  const salvato = localStorage.getItem("theme");
  if (salvato) radice.dataset.theme = salvato;
} catch { /* ignorato */ }

let M = null;
let corrente = null;

document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const p = radice.dataset.theme === "dark" ? "light" : "dark";
  radice.dataset.theme = p;
  try { localStorage.setItem("theme", p); } catch { /* ignorato */ }
  disegna();
});

const video = $("video");

/* ---- lettura del manifesto ------------------------------------------------ */
async function carica() {
  const r = await fetch("media/manifesto.json", { cache: "no-cache" });
  if (!r.ok) throw new Error(`manifesto non caricato (HTTP ${r.status})`);
  M = await r.json();
  tabella();
  sensibilita();
  bottoni();
  provenienza();
  scegli(Object.keys(M.bracci)[0]);
}

const nomi = {
  "intatto": "Intact",
  "LC4": "LC4 removed",
  "LPLC2": "LPLC2 removed",
  "casuale 1": "311 at random · draw 1",
  "casuale 2": "311 at random · draw 2",
  "casuale 3": "311 at random · draw 3",
};
const etichetta = (k) => nomi[k] ?? k;

/* ---- tabella degli esiti -------------------------------------------------- */
function tabella() {
  const t = $("tabella");
  const righe = Object.entries(M.bracci).map(([k, b]) => {
    const preso = b.esito === "catturata";
    return `<tr data-arm="${k}">
      <td>${etichetta(k)}</td>
      <td>${b.n_spenti.toLocaleString("en")}</td>
      <td>${b.picco_gf_hz.toFixed(1)}</td>
      <td>${b.t_salto_s == null ? "—" : b.t_salto_s.toFixed(2) + " s"}</td>
      <td>${b.distanza_alla_presa_mm.toFixed(1)}</td>
      <td class="pr-esito ${preso ? "presa" : "salva"}">${preso ? "CAUGHT" : "ESCAPED"}</td>
    </tr>`;
  }).join("");
  t.innerHTML = `<thead><tr>
      <th scope="col">Condition</th><th scope="col">Neurons off</th>
      <th scope="col">Giant fibre peak</th><th scope="col">Jumped at</th>
      <th scope="col">Distance at the grab (mm)</th><th scope="col">Outcome</th>
    </tr></thead><tbody>${righe}</tbody>` + t.innerHTML;
  for (const tr of t.querySelectorAll("tbody tr")) {
    tr.addEventListener("click", () => scegli(tr.dataset.arm));
  }
}

function sensibilita() {
  const taus = Object.keys(Object.values(M.bracci)[0].sensibilita_tau)
    .map(Number).sort((a, b) => a - b);
  const capo = taus.map((x) => `<th scope="col">${x} ms</th>`).join("");
  const righe = Object.entries(M.bracci).map(([k, b]) => {
    const celle = taus.map((x) => {
      const preso = b.sensibilita_tau[String(x)];
      return `<td class="pr-esito ${preso ? "presa" : "salva"}">${preso ? "caught" : "escaped"}</td>`;
    }).join("");
    return `<tr><td>${etichetta(k)}</td>${celle}</tr>`;
  }).join("");
  $("sensibilita").innerHTML =
    `<thead><tr><th scope="col">Condition</th>${capo}</tr></thead><tbody>${righe}</tbody>`;
}

function bottoni() {
  $("bracci").innerHTML = Object.keys(M.bracci).map((k) =>
    `<button class="pr-arm" type="button" role="radio" aria-checked="false" data-arm="${k}">${etichetta(k)}</button>`
  ).join("");
  for (const b of $("bracci").querySelectorAll("[data-arm]")) {
    b.addEventListener("click", () => scegli(b.dataset.arm));
  }
}

/* ---- sincronia video / traccia -------------------------------------------- */
// Il video e' a 25 fps e ogni fotogramma vale un passo di controllo da 10 ms:
// il tempo del video non e' il tempo simulato, e leggere la traccia con il primo
// dava numeri sbagliati.
function tempoSim(tVideo) {
  return Math.round(tVideo * M.protocollo.fps) * (M.protocollo.dt_ms / 1000);
}
function indiceA(tVideo) {
  const tr = M.bracci[corrente].traccia;
  const i = Math.round(tempoSim(tVideo) / (M.protocollo.dt_ms / 1000));
  return Math.max(0, Math.min(tr.length - 1, i));
}

function scegli(k) {
  corrente = k;
  for (const b of $("bracci").querySelectorAll("[data-arm]")) {
    b.setAttribute("aria-checked", String(b.dataset.arm === k));
  }
  for (const tr of $("tabella").querySelectorAll("tbody tr")) {
    tr.classList.toggle("scelto", tr.dataset.arm === k);
  }
  const t = video.currentTime;
  const inCorso = !video.paused && !video.ended;
  video.src = `media/${M.bracci[k].video}`;
  video.addEventListener("loadeddata", () => {
    video.currentTime = Math.min(t, video.duration || 0);   // stesso istante: confronto appaiato
    if (inCorso) video.play().catch(() => {});
    aggiorna();
  }, { once: true });
  aggiorna();
}

/* ---- verdetto e numeri ----------------------------------------------------- */
function aggiorna() {
  if (!M || !corrente) return;
  const b = M.bracci[corrente];
  const p = M.protocollo;
  const i = indiceA(video.currentTime);
  const kArrivo = b.k_arrivo;
  const kPresa = kArrivo + p.ritardo_passi;
  const preso = b.esito === "catturata";
  const badge = $("verdetto");
  if (i < kArrivo) {
    badge.className = "pr-badge";
    badge.textContent = "predator closing";
  } else if (i < kPresa) {
    badge.className = "pr-badge";
    badge.textContent = "it has arrived — grabbing";
  } else {
    badge.className = `pr-badge ${preso ? "presa" : "salva"}`;
    badge.textContent = preso ? "CAUGHT" : "ESCAPED";
  }
  const r = b.traccia[i];
  $("adesso").textContent =
    `t ${r.t.toFixed(2)} s · giant fibre ${r.gf.toFixed(1)} Hz · `
    + (r.dS == null ? "predator has not committed" : `${r.dS.toFixed(1)} mm from the strike point`);
  disegna();
}

/* ---- il grafico: distanza dal punto del colpo ------------------------------ */
function disegna() {
  if (!M || !corrente) return;
  const c = $("grafico");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = c.clientWidth || 640, h = 340;
  if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  const g = c.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);

  const stile = getComputedStyle(document.body);
  const inchiostro = stile.color || "#222";
  const tenue = (a) => `color-mix(in srgb, ${inchiostro} ${a}%, transparent)`;

  const b = M.bracci[corrente], p = M.protocollo, tr = b.traccia;
  const presa = p.presa_mm;
  const kArrivo = b.k_arrivo, kPresa = kArrivo + p.ritardo_passi;
  const dati = tr.map((r, i) => ({ i, d: r.dS })).filter((x) => x.d != null);
  if (!dati.length) return;

  const m = { l: 46, r: 12, t: 14, b: 30 };
  const i0 = dati[0].i, i1 = tr.length - 1;
  const dMax = Math.max(presa * 1.8, ...dati.map((x) => x.d)) * 1.08;
  const X = (i) => m.l + ((i - i0) / Math.max(i1 - i0, 1)) * (w - m.l - m.r);
  const Y = (d) => h - m.b - (d / dMax) * (h - m.t - m.b);

  // banda "a portata"
  g.fillStyle = `color-mix(in srgb, #d07a4f 16%, transparent)`;
  g.fillRect(m.l, Y(presa), w - m.l - m.r, h - m.b - Y(presa));
  g.strokeStyle = `color-mix(in srgb, #d07a4f 70%, transparent)`;
  g.lineWidth = 1; g.beginPath(); g.moveTo(m.l, Y(presa)); g.lineTo(w - m.r, Y(presa)); g.stroke();
  g.fillStyle = tenue(70); g.font = "11px ui-monospace, monospace"; g.textAlign = "left";
  g.fillText(`within reach · ${presa} mm`, m.l + 6, Y(presa) - 5);

  // assi
  g.strokeStyle = tenue(30); g.beginPath();
  g.moveTo(m.l, m.t); g.lineTo(m.l, h - m.b); g.lineTo(w - m.r, h - m.b); g.stroke();
  g.fillStyle = tenue(65); g.textAlign = "right";
  for (const d of [0, presa, Math.round(dMax / 10) * 10 >= presa * 1.5 ? Math.round(dMax / 10) * 10 : null].filter((x) => x != null)) {
    g.fillText(String(d), m.l - 6, Y(d) + 4);
  }
  g.save(); g.translate(13, h / 2); g.rotate(-Math.PI / 2); g.textAlign = "center";
  g.fillText("distance from the strike point (mm)", 0, 0); g.restore();

  // arrivo e presa
  for (const [k, tratto, testo] of [[kArrivo, [4, 4], "arrives"], [kPresa, [], "grabs"]]) {
    g.save(); g.setLineDash(tratto); g.strokeStyle = tenue(45);
    g.beginPath(); g.moveTo(X(k), m.t); g.lineTo(X(k), h - m.b); g.stroke(); g.restore();
    g.fillStyle = tenue(60); g.textAlign = "center"; g.fillText(testo, X(k), m.t + 10);
  }

  // gli altri bracci, tenui
  for (const [k, o] of Object.entries(M.bracci)) {
    if (k === corrente) continue;
    g.strokeStyle = tenue(14); g.lineWidth = 1; g.beginPath();
    o.traccia.forEach((r, i) => { if (r.dS == null) return; const x = X(i), y = Y(r.dS); i === i0 ? g.moveTo(x, y) : g.lineTo(x, y); });
    g.stroke();
  }

  // il braccio scelto
  const preso = b.esito === "catturata";
  g.strokeStyle = preso ? "#c2502a" : "#2a8f56";
  g.lineWidth = 2.2; g.beginPath();
  dati.forEach((x, n) => { const px = X(x.i), py = Y(x.d); n ? g.lineTo(px, py) : g.moveTo(px, py); });
  g.stroke();

  // il punto che decide
  const dPresa = tr[Math.min(kPresa, tr.length - 1)].dS;
  if (dPresa != null) {
    g.fillStyle = preso ? "#c2502a" : "#2a8f56";
    g.beginPath(); g.arc(X(kPresa), Y(dPresa), 4.5, 0, Math.PI * 2); g.fill();
  }

  // dove siamo nel video
  const i = indiceA(video.currentTime);
  if (tr[i]?.dS != null) {
    g.strokeStyle = tenue(55); g.lineWidth = 1; g.beginPath();
    g.moveTo(X(i), m.t); g.lineTo(X(i), h - m.b); g.stroke();
  }
}

/* ---- provenienza ----------------------------------------------------------- */
function provenienza() {
  const p = M.protocollo;
  const voci = [
    ["connectome", `MaleCNS v1.0 · ${M.neuroni_totali.toLocaleString("en")} neurons`],
    ["neural model", "flyverse-core, spiking LIF with its receptor model — no training, no fitting"],
    ["vision", "1,466 retinal columns · 7 rays each over a 4.5° acceptance angle · cast into the scene"],
    ["body", "NeuroMechFly in MuJoCo · six legs, adhesion, solver-resolved contacts"],
    ["predator", `${p.predatore} · ${p.apertura_mm} mm leg span · ${p.velocita_mm_s / 1000} m/s · from behind · stops with its legs on the strike point`],
    ["capture rule", p.criterio],
    ["jump", `${p.salto_mm_s / 1000} m/s at 45° above the horizon — a motor readout, measured to land this body on its feet`],
    ["conditions", "identical starting state; only the lesion differs"],
    ["controls", "three independent random draws of the same size as the targeted lesion"],
    ["determinism", "synaptic depression off, so a repeat of a condition is identical"],
    ["speed", `recorded on one H200, replayed at ${(p.fps * p.dt_ms / 1000).toFixed(2)}× speed`],
    ["licence", "MaleCNS v1.0 CC BY 4.0 · flyverse-core MIT"],
  ];
  $("prov").innerHTML = voci.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
}

/* ---- comandi ---------------------------------------------------------------- */
$("play").addEventListener("click", () => {
  if (video.paused) video.play().catch(() => {}); else video.pause();
});
$("restart").addEventListener("click", () => { video.currentTime = 0; video.play().catch(() => {}); });
// `timeupdate` non scatta scorrendo a video fermo: senza `seeked` i numeri
// restavano all'istante zero mentre l'immagine era gia' altrove.
for (const ev of ["timeupdate", "seeked", "loadedmetadata", "loadeddata"]) {
  video.addEventListener(ev, aggiorna);
}
video.addEventListener("play", () => { $("play").textContent = "Pause"; });
video.addEventListener("pause", () => { $("play").textContent = "Play"; });
video.addEventListener("ended", () => { $("play").textContent = "Play"; });
window.addEventListener("resize", disegna);

carica().catch((e) => {
  $("verdetto").textContent = "could not load the runs — " + e.message;
});
