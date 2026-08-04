const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];

function updateThemeLabel() {
  const isDark = root.dataset.theme === "dark";
  themeButton?.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeButton?.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
}

updateThemeLabel();

themeButton?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateThemeLabel();
});

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("open")) {
    navLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.focus();
  }
});

const sections = navAnchors
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navAnchors.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-20% 0px -65%", threshold: [0, 0.2, 0.6] }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelector("#year").textContent = new Date().getFullYear();

