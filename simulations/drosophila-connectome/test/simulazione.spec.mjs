/* Test di browser della simulazione, sul percorso annidato esatto della
 * produzione (/simulations/drosophila-connectome/), non alla radice.
 *
 *   BASE=http://127.0.0.1:8731 npx playwright test simulazione.spec.mjs
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE || "http://127.0.0.1:8731";
const APP = `${BASE}/simulations/drosophila-connectome/`;

/** Raccoglie errori di console, errori di pagina e richieste fallite. */
function sorveglia(page) {
  const problemi = { console: [], pagina: [], rete: [] };
  page.on("console", (m) => { if (m.type() === "error") problemi.console.push(m.text()); });
  page.on("pageerror", (e) => problemi.pagina.push(String(e)));
  page.on("requestfailed", (r) => problemi.rete.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => { if (r.status() >= 400) problemi.rete.push(`${r.url()} HTTP ${r.status()}`); });
  return problemi;
}

async function apri(page) {
  const problemi = sorveglia(page);
  await page.goto(APP, { waitUntil: "load" });
  // l'app compare solo se l'autotest del worker contro il riferimento Python passa
  await expect(page.locator("#app")).toBeVisible({ timeout: 60000 });
  await expect(page.locator("#errore")).toBeHidden();
  return problemi;
}

const sommario = async (page) => (await page.locator("#stato-tela").textContent()) || "";

/** Il passo corrente letto dallo stato, dopo essersi assicurati che ci sia.
 *  Senza l'attesa si legge la riga ancora vuota, si ottiene -1 e ogni conteggio
 *  successivo resta sfalsato di uno: era la causa degli ultimi tre fallimenti. */
async function passoCorrente(page) {
  await expect(page.locator("#stato-tela")).toContainText(/step \d+ /);
  const t = await sommario(page);
  const m = t.match(/step (\d+)/);
  if (!m) throw new Error(`stato senza numero di passo: ${JSON.stringify(t)}`);
  return Number(m[1]);
}

/** Clicca Step n volte e ASPETTA che lo stato mostri il passo atteso.
 *  Senza questa attesa i click corrono davanti alle risposte del worker e il
 *  test legge uno stato intermedio: era la causa di sette fallimenti. */
async function avanza(page, n) {
  const da = await passoCorrente(page);
  for (let i = 0; i < n; i++) await page.getByRole("button", { name: "Step" }).click();
  await expect(page.locator("#stato-tela")).toContainText(`step ${da + n} `);
  return da + n;
}

test("avvio a freddo: l'app raggiunge uno stato usabile senza errori", async ({ page }) => {
  const problemi = await apri(page);
  await expect(page.locator("#tela")).toBeVisible();
  await expect(page.locator("#prov-tabella")).toBeVisible();
  expect(problemi.pagina, "errori di pagina").toEqual([]);
  expect(problemi.rete, "richieste fallite").toEqual([]);
  expect(problemi.console, "errori di console").toEqual([]);
});

test("collegamento diretto e ricarica forzata al percorso annidato", async ({ page }) => {
  await apri(page);
  await page.reload({ waitUntil: "load" });
  await expect(page.locator("#app")).toBeVisible({ timeout: 60000 });
  await expect(page.locator("#errore")).toBeHidden();
});

test("la provenienza mostra dataset, impronta e riduzione", async ({ page }) => {
  await apri(page);
  const prov = page.locator("#prov-tabella");
  await expect(prov).toContainText("malecns");
  await expect(prov).toContainText("ef23cc27bea13be7f6a96f3c04fd3737");   // impronta del connettoma
  await expect(prov).toContainText("0e30e4a80cb607d4a168d1b08ebd6a40");   // pesi spediti
  await expect(prov).toContainText("regions.pare");
});

test("avanzamento a passo singolo e corsa continua", async ({ page }) => {
  await apri(page);
  await avanza(page, 1);
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "Pause" }).click();
  const s = await sommario(page);
  const passo = Number(s.match(/step (\d+)/)?.[1] ?? 0);
  expect(passo, "la corsa continua deve avanzare oltre il passo 1").toBeGreaterThan(1);
});

test("cambiare la direzione del vento cambia la risposta e azzera lo stato", async ({ page }) => {
  await apri(page);
  const leggi = async () => (await page.locator("#lettura").textContent()) || "";
  await page.locator("#vento").fill("-90");
  await expect(page.locator("#stato-tela")).toContainText("step 0 ");
  await avanza(page, 41);
  const a = await leggi();
  await page.locator("#vento").fill("90");
  await expect(page.locator("#stato-tela")).toContainText("step 0 ");   // il cambio azzera
  await avanza(page, 41);
  const b = await leggi();
  expect(a).not.toEqual(b);
});

test("la lesione cambia il calcolo, e il ripristino lo riporta identico", async ({ page }) => {
  await apri(page);
  await avanza(page, 30);
  const intatto = await sommario(page);

  await page.locator("#gruppo").selectOption({ index: 0 });
  await page.getByRole("button", { name: "Remove group" }).click();
  await expect(page.locator("#stato-lesione")).toContainText("removed from the computation");
  await expect(page.locator("#stato-tela")).toContainText("step 0 ");   // la lesione azzera lo stato
  await avanza(page, 30);
  const leso = await sommario(page);
  expect(leso, "la lesione deve cambiare lo stato").not.toEqual(intatto);

  await page.getByRole("button", { name: "Restore all" }).click();
  await expect(page.locator("#stato-lesione")).toContainText("no lesion");
  await expect(page.locator("#stato-tela")).toContainText("step 0 ");
  await avanza(page, 30);
  expect(await sommario(page), "il ripristino deve tornare esattamente all'intatto").toEqual(intatto);
});

test("confronto appaiato: stesse condizioni, solo la lesione cambia", async ({ page }) => {
  await apri(page);
  // senza lesione i due bracci devono coincidere: e' il controllo del controllo
  await page.getByRole("button", { name: "Run matched pair" }).click();
  await expect(page.locator("#tabella-confronto")).toBeVisible();
  const senzaLesione = await page.locator("#tabella-confronto").textContent();
  expect(senzaLesione).toContain("intact");
  const differenze = await page.locator("#tabella-confronto td.diff-si").count();
  expect(differenze, "senza lesione nessuna riga deve differire").toBe(0);

  await page.locator("#gruppo").selectOption({ index: 0 });
  await page.getByRole("button", { name: "Remove group" }).click();
  await expect(page.locator("#stato-lesione")).toContainText("removed from the computation");
  await page.getByRole("button", { name: "Run matched pair" }).click();
  await expect(page.locator("#tabella-confronto")).toBeVisible();
  await expect(page.locator("#tabella-confronto td.diff-si").first()).toBeVisible();
  const conLesione = await page.locator("#tabella-confronto td.diff-si").count();
  expect(conLesione, "con lesione qualche riga deve differire").toBeGreaterThan(0);
});

test("determinismo: due corse identiche danno lo stesso risultato", async ({ page }) => {
  await apri(page);
  const corsa = async () => {
    await page.getByRole("button", { name: "Reset state" }).click();
    await expect(page.locator("#stato-tela")).toContainText("step 0 ");
    await avanza(page, 25);
    return (await page.locator("#lettura").textContent()) || "";
  };
  expect(await corsa()).toEqual(await corsa());
});

test("tastiera: i comandi essenziali sono raggiungibili", async ({ page }) => {
  await apri(page);
  const bottone = page.getByRole("button", { name: "Step" });
  await bottone.focus();
  await expect(bottone).toBeFocused();
  await passoCorrente(page);                 // assicura che lo stato sia pronto
  await bottone.press("Enter");
  await expect(page.locator("#stato-tela")).toContainText("step 1 ");
});

test("mobile: l'interazione principale funziona su viewport stretto", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true });
  const page = await ctx.newPage();
  await apri(page);
  await expect(page.locator("#tela")).toBeVisible();
  await avanza(page, 1);
  // nessuno scorrimento orizzontale del corpo pagina
  const scorre = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(scorre, "la pagina non deve scorrere in orizzontale").toBe(false);
  await ctx.close();
});

test("il resto del sito non regredisce", async ({ page }) => {
  const problemi = sorveglia(page);
  await page.goto(BASE, { waitUntil: "load" });
  await expect(page.locator('a[href="#simulations"]')).toBeVisible();
  await expect(page.locator("#simulations")).toBeAttached();
  for (const id of ["research", "projects", "teaching", "services", "videogames", "contact"]) {
    await expect(page.locator(`#${id}`), `sezione ${id}`).toBeAttached();
  }
  await page.goto(`${BASE}/simulations/`, { waitUntil: "load" });
  await expect(page.getByRole("heading", { name: "Scientific simulations" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the laboratory/ })).toBeVisible();
  expect(problemi.pagina).toEqual([]);
  expect(problemi.rete).toEqual([]);
});

test("cattura le immagini della release", async ({ page }) => {
  await apri(page);
  await avanza(page, 60);
  await page.locator("#tela").screenshot({ path: "out/circuito.png" });
  await page.screenshot({ path: "out/pagina.png", fullPage: false });
});

/* ---- la simulazione 3D registrata ---------------------------------------- */

const E3 = `${BASE}/simulations/drosophila-escape-3d/`;

async function apri3d(page) {
  const problemi = sorveglia(page);
  await page.goto(E3, { waitUntil: "load" });
  await expect(page.locator("#video")).toBeVisible();
  await expect(page.locator("#prov")).toContainText("MaleCNS");
  return problemi;
}

test("3D: avvio a freddo senza errori", async ({ page }) => {
  const problemi = await apri3d(page);
  await expect(page.locator("#lettura")).toContainText("Intact");
  expect(problemi.pagina).toEqual([]);
  // ERR_ABORTED sui video e' normale: il player interrompe il caricamento
  // precedente quando si cambia condizione
  expect(problemi.rete.filter((r) => !/ERR_ABORTED/.test(r))).toEqual([]);
});

test("3D: il video e' scorribile (serve Range dal server)", async ({ page }) => {
  await apri3d(page);
  await page.waitForFunction(() => document.getElementById("video").readyState >= 2, null, { timeout: 30000 });
  const s = await page.locator("#video").evaluate((v) => ({
    fine: v.seekable.length ? v.seekable.end(0) : 0, durata: v.duration }));
  expect(s.fine, "seekable deve coprire il video: senza Range resta 0").toBeGreaterThan(1);
  expect(s.durata).toBeGreaterThan(1);
});

test("3D: la lesione giusta spegne la risposta, 311 neuroni a caso no", async ({ page }) => {
  await apri3d(page);
  // si confrontano i PICCHI della corsa, non un istante fisso: il salto sposta
  // i tempi e un istante cablato nel test diventa fragile
  const picco = async (arm) => {
    if (arm) {
      await page.locator(`[data-arm="${arm}"]`).click();
      await page.waitForFunction(() => document.getElementById("video").readyState >= 1, null, { timeout: 30000 });
    }
    await expect(page.locator("#lettura")).toContainText("peak this run");
    const t = await page.locator("#lettura").textContent();
    return Number(t.match(/peak this run([\d.]+) Hz/)?.[1] ?? -1);
  };
  expect(await picco(null), "intatto deve superare i 33 Hz").toBeGreaterThan(33);
  expect(await picco("LC4"), "senza LC4 la risposta sopravvive").toBeGreaterThan(33);
  expect(await picco("LPLC2"), "senza LPLC2 deve stare sotto soglia").toBeLessThan(33);
  expect(await picco("casuale appaiato"),
    "311 neuroni a caso non devono abolire la risposta").toBeGreaterThan(33);
});

test("3D: la pagina dichiara cosa il modello non fa", async ({ page }) => {
  await apri3d(page);
  const testo = await page.locator("main").textContent();
  for (const frase of ["does not fly", "does not forage", "recorded runs",
                       "nothing catches the fly", "the jump itself is not"]) {
    expect(testo.toLowerCase()).toContain(frase);
  }
});

test("3D: mobile, nessuno scorrimento orizzontale", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true });
  const page = await ctx.newPage();
  await apri3d(page);
  const scorre = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(scorre).toBe(false);
  await ctx.close();
});
