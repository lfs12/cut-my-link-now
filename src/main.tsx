import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Theme handling ---
function applyThemeClass() {
  const theme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const html = document.documentElement;
  if (theme === "dark" || (!theme && prefersDark)) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

// Inicializa el tema al cargar
applyThemeClass();

// Observa cambios en localStorage para el tema
window.addEventListener("storage", (e) => {
  if (e.key === "theme") applyThemeClass();
});

// // Opcional: expón función global para cambiar tema desde componentes
// window.setTheme = (theme: "light" | "dark") => {
//   localStorage.setItem("theme", theme);
//   applyThemeClass();
// };
//Si setTheme no existe en window, se puede agregar la siguiente línea:
(window as any).setTheme = (theme: "light" | "dark") => { 
    localStorage.setItem("theme", theme);
    applyThemeClass();
};

createRoot(document.getElementById("root")!).render(<App />);
