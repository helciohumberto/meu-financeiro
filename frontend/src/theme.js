import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#f5f5f5",
              paper: "rgb(255, 255, 255)"
            },
            text: {
              primary: "#1a1a1a"
            }
          }
        : {
            background: {
              default: "#121212",
              paper: "rgb(30, 30, 30)"
            },
            text: {
              primary: "#ffffff"
            }
          })
    },

    shape: {
      borderRadius: 12
    }
  });