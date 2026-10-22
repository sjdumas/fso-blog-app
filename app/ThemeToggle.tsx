"use client";

import { useLayoutEffect } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function currentTheme() {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") {
    return attr;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  // React's dev-mode remount clears the attribute the init script set; re-apply it.
  // This is a no-op in production.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {}
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  // Both icons are rendered; CSS shows the right one, so the server and
  // client markup always match.
  return (
    <button type="button" onClick={toggle} aria-label="Toggle dark mode">
      <span aria-hidden className="dark:hidden">☾ Dark</span>
      <span aria-hidden className="hidden dark:inline">☀ Light</span>
    </button>
  );
}
