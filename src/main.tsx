import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Theme handling ---
function applyThemeClass() {
  const theme = localStorage.getItem("theme") || "auto";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const html = document.documentElement;
  
  html.classList.remove("light", "dark");
  
  if (theme === "auto") {
    html.classList.add(prefersDark ? "dark" : "light");
  } else {
    html.classList.add(theme);
  }
}

applyThemeClass();

window.addEventListener("storage", (e) => {
  if (e.key === "theme") applyThemeClass();
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const theme = localStorage.getItem("theme");
  if (!theme || theme === "auto") {
    applyThemeClass();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
