(function () {
  const storageKey = "theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function readStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (_error) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (_error) {
      // Ignore storage failures; the toggle still works for this page view.
    }
  }

  function preferredTheme() {
    return media.matches ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    if (persist) {
      writeStoredTheme(theme);
    }
    updateToggle(theme);
  }

  function updateToggle(theme) {
    const button = document.querySelector("[data-theme-toggle]");
    const label = document.querySelector("[data-theme-label]");
    if (!button || !label) {
      return;
    }
    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    label.textContent = isDark ? "Light" : "Dark";
  }

  const storedTheme = readStoredTheme();
  applyTheme(storedTheme || preferredTheme(), false);

  document.addEventListener("DOMContentLoaded", () => {
    updateToggle(root.getAttribute("data-theme"));

    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || preferredTheme();
        applyTheme(current === "dark" ? "light" : "dark", true);
      });
    }

    media.addEventListener("change", () => {
      if (!readStoredTheme()) {
        applyTheme(preferredTheme(), false);
      }
    });
  });
})();
