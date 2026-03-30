import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import { useState } from "react";

function Root() {
  const [mode, setMode] = useState("light");

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

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