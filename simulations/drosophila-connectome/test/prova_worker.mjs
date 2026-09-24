/* Prova che il worker riproduca il riferimento Python.
 *
 * Il worker gira nel browser, ma le sue equazioni sono JavaScript puro: si
 * possono eseguire in node fornendo le poche cose che si aspetta dall'ambiente
 * (`self`, `fetch`, `postMessage`). Non e' un test del browser -- quelli sono
 * in Playwright -- ma e' il test che conta per la scienza: se qui i numeri non
 * tornano, non ha senso costruirci sopra un'interfaccia.
 *
 *   node test/prova_worker.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const QUI = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(QUI, "..");

const messaggi = [];
let alMessaggio = null;

// ambiente minimo che worker.js si aspetta
globalThis.self = {
  location: { href: pathToFileURL(path.join(APP, "worker.js")).href },
  postMessage: (m) => { messaggi.push(m); },
  set onmessage(f) { alMessaggio = f; },
  get onmessage() { return alMessaggio; },
};
globalThis.fetch = async (url) => {
  const p = fileURLToPath(typeof url === "string" ? url : url.href);
  try {
    const buf = await readFile(p);
    return {
      ok: true, status: 200,
      json: async () => JSON.parse(buf.toString("utf8")),
      arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    };
  } catch (e) {
    return { ok: false, status: 404, json: async () => ({}), arrayBuffer: async () => new ArrayBuffer(0) };
  }
};

await import(pathToFileURL(path.join(APP, "worker.js")).href);

function attendi(tipo, timeoutMs = 60000) {
  const t0 = Date.now();
  return new Promise((risolvi, rifiuta) => {
    const controlla = () => {
      const i = messaggi.findIndex((m) => m.tipo === tipo || m.tipo === "errore");
      if (i >= 0) {
        const m = messaggi.splice(i, 1)[0];
        return m.tipo === "errore"
          ? rifiuta(new Error(`${m.fase}: ${m.messaggio}`))
          : risolvi(m);
      }
      if (Date.now() - t0 > timeoutMs) return rifiuta(new Error(`timeout attendendo ${tipo}`));
      setImmediate(controlla);
    };
    controlla();
  });
}

let falliti = 0;
function verifica(nome, condizione, dettaglio = "") {
  const esito = condizione ? "OK     " : "FALLITO";
  if (!condizione) falliti++;
  console.log(`  ${esito}  ${nome}${dettaglio ? "   " + dettaglio : ""}`);
}

console.log("carico il worker e faccio l'autotest contro il riferimento Python...\n");
self.onmessage({ data: { tipo: "carica" } });
const pronto = await attendi("pronto");

console.log(`grafo: ${pronto.info.n} neuroni, ${pronto.info.archi.toLocaleString("it")} archi`);
console.log(`tolleranza relativa dichiarata: ${pronto.test.tolleranza}\n`);
for (const e of pronto.test.esiti) {
  const scarto = e.atteso ? Math.abs(e.ottenuto - e.atteso) / Math.abs(e.atteso) : 0;
  verifica(e.nome, e.ok,
    `atteso ${e.atteso.toFixed(4)}  ottenuto ${e.ottenuto.toFixed(4)}  scarto ${(scarto * 100).toExponential(2)} %`
    + (e.attesiAttivi !== undefined ? `  attivi ${e.ottenutiAttivi}/${e.attesiAttivi}` : ""));
}

console.log("\nprove sul comportamento:");

// la lesione deve cambiare il calcolo, non solo il disegno
self.onmessage({ data: { tipo: "azzera", azimut: -90 } });
await attendi("stato");
self.onmessage({ data: { tipo: "avanza", passi: 150 } });
const intatto = (await attendi("stato")).sommario;

self.onmessage({ data: { tipo: "confronto", azimut: -90, passi: 150 } });
const c0 = await attendi("confronto");
verifica("confronto senza lesioni: i due bracci coincidono",
  Math.abs(c0.risultati.intatto.somma - c0.risultati.lesionato.somma) < 1e-6,
  `${c0.risultati.intatto.somma.toFixed(4)} vs ${c0.risultati.lesionato.somma.toFixed(4)}`);

// lesiona i JO di un lato e verifica che l'asimmetria cambi
const nodi = await (async () => {
  self.onmessage({ data: { tipo: "nodi" } });
  return (await attendi("nodi")).nodi;
})();
const daLesionare = [];
for (let i = 0; i < nodi.n; i++) if (nodi.is_sorgente[i] && nodi.lato_vento[i] > 0) daLesionare.push(i);
verifica("ci sono sorgenti da lesionare", daLesionare.length > 0, `${daLesionare.length} JO di un lato`);

self.onmessage({ data: { tipo: "lesiona", indici: daLesionare, attiva: true, azimut: -90 } });
await attendi("lesione");
self.onmessage({ data: { tipo: "confronto", azimut: -90, passi: 150 } });
const c1 = await attendi("confronto");
const dInt = c1.risultati.intatto.lettura.DNa02_asimmetria;
const dLes = c1.risultati.lesionato.lettura.DNa02_asimmetria;
verifica("la lesione cambia l'asimmetria di DNa02", Math.abs(dInt - dLes) > 1e-4,
  `intatto ${dInt.toFixed(4)}  lesionato ${dLes.toFixed(4)}`);
verifica("la lesione cambia la somma dei tassi",
  Math.abs(c1.risultati.intatto.somma - c1.risultati.lesionato.somma) > 1e-3,
  `${c1.risultati.intatto.somma.toFixed(2)} vs ${c1.risultati.lesionato.somma.toFixed(2)}`);

// il ripristino deve tornare esattamente all'intatto
self.onmessage({ data: { tipo: "azzera_lesioni", azimut: -90 } });
const az = await attendi("lesione");
verifica("azzera_lesioni riporta a zero lesioni", az.lesionati === 0);
self.onmessage({ data: { tipo: "azzera", azimut: -90 } });
await attendi("stato");
self.onmessage({ data: { tipo: "avanza", passi: 150 } });
const ripristinato = (await attendi("stato")).sommario;
verifica("dopo il ripristino il risultato e' identico all'intatto",
  Math.abs(ripristinato.somma - intatto.somma) < 1e-6,
  `${ripristinato.somma.toFixed(6)} vs ${intatto.somma.toFixed(6)}`);

// determinismo
self.onmessage({ data: { tipo: "azzera", azimut: 30 } });
await attendi("stato");
self.onmessage({ data: { tipo: "avanza", passi: 77 } });
const a = (await attendi("stato")).sommario;
self.onmessage({ data: { tipo: "azzera", azimut: 30 } });
await attendi("stato");
self.onmessage({ data: { tipo: "avanza", passi: 77 } });
const b = (await attendi("stato")).sommario;
verifica("due corse identiche danno lo stesso risultato, bit per bit",
  a.somma === b.somma && a.attivi === b.attivi, `${a.somma} vs ${b.somma}`);

// il segno dell'asimmetria deve invertirsi col lato del vento
const asim = {};
for (const azm of [-90, 90]) {
  self.onmessage({ data: { tipo: "azzera", azimut: azm } });
  await attendi("stato");
  self.onmessage({ data: { tipo: "avanza", passi: 150 } });
  asim[azm] = (await attendi("stato")).sommario.lettura.DNa02_asimmetria;
}
verifica("l'asimmetria di DNa02 inverte il segno col lato del vento",
  Math.sign(asim[-90]) === -Math.sign(asim[90]) && Math.abs(asim[-90]) > 1e-3,
  `-90° ${asim[-90].toFixed(4)}   +90° ${asim[90].toFixed(4)}`);

console.log(`\n${falliti === 0 ? "tutte le prove superate" : `${falliti} PROVE FALLITE`}`);
process.exit(falliti === 0 ? 0 : 1);
