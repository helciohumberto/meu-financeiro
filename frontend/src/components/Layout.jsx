import { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import AiChat from "./AiChat";
import { LightMode, DarkMode } from "@mui/icons-material";

export default function Layout({ children, toggleTheme, mode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: (theme) => theme.palette.background.default
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: (theme) => theme.palette.background.paper,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

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

          {!collapsed && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" color="text.disabled" display="block" lineHeight={1.4}>
                Desenvolvido por
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" lineHeight={1.4}>
                Hélcio Humberto
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

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

      <AiChat />
    </Box>
  );
}