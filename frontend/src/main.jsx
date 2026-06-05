import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/inputs.css";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import { useState } from "react";

const THEME_KEY = "meu-financeiro:theme";

function getInitialMode() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  // Respeita a preferência do sistema na primeira execução
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function Root() {
  const [mode, setMode] = useState(getInitialMode);

  const toggleTheme = () =>
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <App toggleTheme={toggleTheme} mode={mode} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);