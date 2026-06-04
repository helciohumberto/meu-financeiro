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

          // Estilo translúcido adaptado ao tema
          background: (theme) => theme.palette.background.paper,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "2px 0 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Sidebar />

        {/* Botão de alternar tema */}
        <Box sx={{ p: 2, mt: "auto", textAlign: "center" }}>
          <Tooltip title="Alternar tema">
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