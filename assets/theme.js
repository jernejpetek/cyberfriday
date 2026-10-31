"use strict";
(() => {
  const KEY = "cyberfriday_theme_v1";
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");

  function savedTheme() {
    try {
      const value = localStorage.getItem(KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch { return null; }
  }

  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const button = document.getElementById("themeToggle");
    if (button) {
      const isDark = theme === "dark";
      button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      button.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
      button.setAttribute("aria-pressed", String(isDark));
      button.querySelector(".theme-toggle__icon").textContent = isDark ? "☀" : "☾";
      button.querySelector(".theme-toggle__text").textContent = isDark ? "Light" : "Dark";
    }
  }

  // Runs in <head> before styles load to avoid a light-theme flash.
  apply(savedTheme() || (system.matches ? "dark" : "light"));

  function init() {
    const header = document.querySelector(".header-inner, .topbar__inner");
    if (!header) return;
    const button = document.createElement("button");
    button.type = "button";
    button.id = "themeToggle";
    button.className = "theme-toggle";
    button.innerHTML = '<span class="theme-toggle__icon" aria-hidden="true"></span><span class="theme-toggle__text"></span>';
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, next); } catch { /* Session-only preference. */ }
      apply(next);
    });
    header.appendChild(button);
    apply(root.dataset.theme);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  const onSystemChange = (event) => {
    if (!savedTheme()) apply(event.matches ? "dark" : "light");
  };
  if (system.addEventListener) system.addEventListener("change", onSystemChange);
  else if (system.addListener) system.addListener(onSystemChange);
  window.addEventListener("storage", (event) => {
    if (event.key === KEY) apply(savedTheme() || (system.matches ? "dark" : "light"));
  });
})();
