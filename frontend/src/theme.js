import { createTheme, alpha } from "@mui/material/styles";

export const getTheme = (mode) => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: { main: "#0d9488", light: "#2dd4bf", dark: "#0f766e" },
      secondary: { main: "#7c3aed" },
      success: { main: "#16a34a" },
      error: { main: "#e11d48" },
      warning: { main: "#f59e0b" },
      info: { main: "#2563eb" },
      divider: isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)",
      ...(isLight
        ? {
            background: { default: "#f6f7f9", paper: "#ffffff" },
            text: { primary: "#0f172a", secondary: "#64748b" },
          }
        : {
            background: { default: "#0f1115", paper: "#1a1d23" },
            text: { primary: "#f1f5f9", secondary: "#94a3b8" },
          }),
    },

    shape: { borderRadius: 14 },

    typography: {
      fontFamily:
        '"Inter", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", sans-serif',
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600 },
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${isLight ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.06)"}`,
            boxShadow: isLight
              ? "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)"
              : "0 1px 2px rgba(0,0,0,0.4)",
            transition: "transform .2s ease, box-shadow .2s ease",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: "none", borderRadius: 10 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isLight
              ? "rgba(15,23,42,0.02)"
              : "rgba(255,255,255,0.03)",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: 8, fontSize: "0.75rem" },
        },
      },
    },
  });
};

/** Tons de superfície tingida usados pelos cards de destaque. */
export const tint = (color, amount = 0.12) => alpha(color, amount);
