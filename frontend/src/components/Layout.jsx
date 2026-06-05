import { Box, IconButton, Tooltip } from "@mui/material";
import Sidebar from "./Sidebar";
import { LightMode, DarkMode } from "@mui/icons-material";

export default function Layout({ children, toggleTheme, mode }) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: (theme) => theme.palette.background.default
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: (theme) => theme.palette.background.paper,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Sidebar />

        {/* Botão de alternar tema */}
        <Box
          sx={{
            p: 2,
            mt: "auto",
            textAlign: "center",
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Tooltip title={mode === "light" ? "Modo escuro" : "Modo claro"}>
            <IconButton onClick={toggleTheme}>
              {mode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Conteúdo */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 5,
          paddingTop: "60px",
          color: (theme) => theme.palette.text.primary
        }}
      >
        {children}
      </Box>
    </Box>
  );
}