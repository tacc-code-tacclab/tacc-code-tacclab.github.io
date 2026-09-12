(function () {
  "use strict";

  const state = { calls: [], visible: 10, filtered: [] };
  const el = (id) => document.getElementById(id);
  const form = el("filters");
  const fields = ["query", "role", "region", "city", "institution", "status", "sort"];

  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const isoDay = (date) => new Date(`${date}T23:59:59`);
  const formatDate = (date) => new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric" }).format(isoDay(date));
  const isActive = (call, now = new Date()) => isoDay(call.deadline) >= now;
  const daysLeft = (call, now = new Date()) => Math.ceil((isoDay(call.deadline) - now) / 86400000);
  const safeUrl = (value) => { try { const url = new URL(value); return url.protocol === "https:" ? url.href : "#"; } catch { return "#"; } };

  function populateSelect(id, values) {
    const select = el(id);
    const existing = new Set([...select.options].map((option) => option.value));
    [...new Set(values.filter(Boolean))].filter((value) => !existing.has(value)).sort((a, b) => a.localeCompare(b, "it")).forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }

  function currentFilters() {
    return Object.fromEntries(fields.map((field) => [field, el(field).value]));
  }

  function matches(call, filters, now = new Date()) {
    const haystack = normalize([call.title, call.sector, call.sectorCode, call.gsd, call.keywords, call.institution, call.city, call.region, call.role].join(" "));
    const tokens = normalize(filters.query).split(/\s+/).filter(Boolean);
    if (tokens.some((token) => !haystack.includes(token))) return false;
    if (filters.role && call.role !== filters.role) return false;
    if (filters.region && call.region !== filters.region) return false;
    if (filters.city && call.city !== filters.city) return false;
    if (filters.institution && call.institution !== filters.institution) return false;
    const active = isActive(call, now);
    if (filters.status === "active" && !active) return false;
    if (filters.status === "expired" && active) return false;
    if (filters.status === "expiring" && (!active || daysLeft(call, now) > 7)) return false;
    return true;
  }

  function sortCalls(calls, sort) {
    return [...calls].sort((a, b) => {
      if (sort === "newest") return b.published.localeCompare(a.published);
      if (sort === "institution") return a.institution.localeCompare(b.institution, "it");
      return a.deadline.localeCompare(b.deadline);
    });
  }

  function card(call) {
    const active = isActive(call);
    const remaining = daysLeft(call);
    const article = document.createElement("article");
    article.className = "call-card";
    const statusText = active ? (remaining === 0 ? "Scade oggi" : remaining === 1 ? "1 giorno" : `${remaining} giorni`) : "Scaduto";
    article.innerHTML = `
      <div class="call-top"><div class="badges"><span class="badge status ${active ? "" : "expired"}">${statusText}</span><span class="badge">${escapeHtml(call.role)}</span></div><span class="deadline">Scadenza · ${formatDate(call.deadline)}</span></div>
      <h3>${escapeHtml(call.title)}</h3>
      <div class="call-meta"><span>⌂ ${escapeHtml(call.institution)}</span><span>⌖ ${escapeHtml(call.city)}, ${escapeHtml(call.region)}</span><span>Pubblicato ${formatDate(call.published)}</span></div>
      <p class="sector"><strong>${escapeHtml(call.sectorCode || call.gsd || "Settore non indicato")}</strong> · ${escapeHtml(call.sector || "Consulta il bando")}</p>
      <div class="call-bottom"><span class="source">Fonte: ${escapeHtml(call.source)}</span><a class="official" href="${safeUrl(call.url)}" target="_blank" rel="noopener">Verifica il bando ufficiale ↗</a></div>`;
    return article;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function render(resetVisible = true) {
    if (resetVisible) state.visible = 10;
    const filters = currentFilters();
    state.filtered = sortCalls(state.calls.filter((call) => matches(call, filters)), filters.sort);
    const cards = el("cards");
    cards.replaceChildren(...state.filtered.slice(0, state.visible).map(card));
    cards.setAttribute("aria-busy", "false");
    if (!state.filtered.length) cards.append(el("empty-template").content.cloneNode(true));
    el("result-count").textContent = state.filtered.length;
    const activeCount = state.filtered.filter((call) => isActive(call)).length;
    el("result-summary").textContent = `${activeCount} aperti · ${state.filtered.length - activeCount} scaduti · ordinamento per ${filters.sort === "deadline" ? "scadenza" : filters.sort === "newest" ? "pubblicazione" : "ateneo"}.`;
    el("load-more").hidden = state.visible >= state.filtered.length;
    history.replaceState(null, "", makeQuery(filters));
  }

  function makeQuery(filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value && !(key === "status" && value === "active") && !(key === "sort" && value === "deadline")) params.set(key, value); });
    return `${location.pathname}${params.size ? `?${params}` : ""}${location.hash}`;
  }

  function applyQuery() {
    const params = new URLSearchParams(location.search);
    fields.forEach((field) => { if (params.has(field)) el(field).value = params.get(field); });
  }

  function updateCities() {
    const chosenRegion = el("region").value;
    const current = el("city").value;
    el("city").innerHTML = '<option value="">Tutte le città</option>';
    populateSelect("city", state.calls.filter((call) => !chosenRegion || call.region === chosenRegion).map((call) => call.city));
    if ([...el("city").options].some((option) => option.value === current)) el("city").value = current;
  }

  async function init() {
    document.querySelector(".theme").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
    });
    try {
      const response = await fetch("data/calls.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Dati non disponibili");
      const payload = await response.json();
      state.calls = payload.calls || [];
      populateSelect("role", state.calls.map((call) => call.role));
      populateSelect("region", state.calls.map((call) => call.region));
      populateSelect("institution", state.calls.map((call) => call.institution));
      updateCities();
      el("freshness").textContent = `Aggiornato · ${new Intl.DateTimeFormat("it-IT", { dateStyle: "medium" }).format(new Date(payload.updatedAt))}`;
      if (payload.coverageNote) { el("data-notice").textContent = payload.coverageNote; el("data-notice").hidden = false; }
      applyQuery();
      updateCities();
      render();
    } catch (error) {
      el("cards").setAttribute("aria-busy", "false");
      el("cards").innerHTML = '<div class="empty"><span>!</span><h3>Dati momentaneamente non disponibili.</h3><p>Puoi consultare direttamente il portale ufficiale MUR dalla sezione Fonti.</p></div>';
      el("data-notice").textContent = error.message;
      el("data-notice").hidden = false;
    }
  }

  form.addEventListener("submit", (event) => { event.preventDefault(); render(); el("results").scrollIntoView({ behavior: "smooth" }); });
  form.addEventListener("change", (event) => { if (event.target.id === "region") updateCities(); render(); });
  let queryTimer;
  el("query").addEventListener("input", () => { clearTimeout(queryTimer); queryTimer = setTimeout(() => render(), 160); });
  el("reset").addEventListener("click", () => { form.reset(); updateCities(); render(); });
  el("load-more").addEventListener("click", () => { state.visible += 10; render(false); });
  document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => {
    form.reset();
    Object.entries(JSON.parse(button.dataset.preset)).forEach(([key, value]) => { el(key).value = value; });
    updateCities(); render(); el("results").scrollIntoView({ behavior: "smooth" });
  }));
  el("save-search").addEventListener("click", () => {
    localStorage.setItem("ateneo-bandi-search", JSON.stringify(currentFilters()));
    el("save-search").textContent = "★ Ricerca salvata";
    el("save-search").classList.add("saved");
  });
  const saved = localStorage.getItem("ateneo-bandi-search");
  if (saved) { el("save-search").textContent = "★ Ricerca salvata"; el("save-search").classList.add("saved"); }

  window.AteneoBandi = { normalize, matches, sortCalls, isActive, daysLeft };
  init();
})();
