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
