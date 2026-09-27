/* Solo il tema: la pagina e' generata dai file di misura e non ha stato. */
const radice = document.documentElement;
try {
  const salvato = localStorage.getItem("theme");
  if (salvato) radice.dataset.theme = salvato;
} catch { /* ignorato */ }
document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const p = radice.dataset.theme === "dark" ? "light" : "dark";
  radice.dataset.theme = p;
  try { localStorage.setItem("theme", p); } catch { /* ignorato */ }
});
