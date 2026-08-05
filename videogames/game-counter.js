(() => {
  "use strict";

  const counters = document.querySelectorAll("[data-game-visitors]");
  if (!counters.length) return;

  if (!document.querySelector("#game-counter-style")) {
    const style = document.createElement("style");
    style.id = "game-counter-style";
    style.textContent = `
      .visitor-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
      .game-visitor-counter{display:inline-flex;min-height:28px;align-items:center;padding:5px 9px;border:1px solid currentColor;border-radius:999px;background:color-mix(in srgb,currentColor 7%,transparent);font:700 10px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.065em;text-transform:uppercase;opacity:.78;white-space:nowrap}
      .game-visitor-counter[data-counter-state="error"]{opacity:.48}
    `;
    document.head.appendChild(style);
  }

  const namespace = "tacc-code-tacclab.github.io";

  counters.forEach(async (counter) => {
    const key = counter.dataset.gameVisitors;
    const label = counter.dataset.counterLabel ? `${counter.dataset.counterLabel} · ` : "";
    const readOnly = counter.hasAttribute("data-counter-readonly");
    const params = new URLSearchParams({ unique: "true" });
    if (readOnly) params.set("readOnly", "true");

    counter.textContent = `${label}… VISITORS`;
    counter.setAttribute("aria-live", "polite");

    try {
      const url = `https://counterapi.com/api/${namespace}/visit/${encodeURIComponent(key)}?${params}`;
      const response = await fetch(url, { mode: "cors", credentials: "omit", cache: "no-store" });
      if (!response.ok) throw new Error(`Counter returned ${response.status}`);
      const result = await response.json();
      const value = Number(result.value);
      if (!Number.isFinite(value)) throw new Error("Counter returned no value");
      counter.textContent = `${label}${value.toLocaleString()} VISITORS`;
      counter.dataset.counterState = "ready";
    } catch (_) {
      counter.textContent = `${label}VISITORS UNAVAILABLE`;
      counter.dataset.counterState = "error";
    }
  });
})();
