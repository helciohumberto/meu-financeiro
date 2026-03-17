import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const SIDEBAR_WIDTH = 220;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* Sidebar fixa */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          background: "#1e1e1e",
          color: "white",
          borderRight: "1px solid #333"
        }}
      >
        <Sidebar />
      </Box>

      {/* Conteúdo */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 4,
          background: "#f5f5f5",
          minHeight: "100vh"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}