import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Início", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Lançamentos", path: "/lancamentos" },
    { label: "Categorias", path: "/categorias" },
    { label: "Configurações", path: "/settings" }
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Meu Financeiro
      </Typography>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              background: location.pathname === item.path ? "#333" : "transparent",
              borderRadius: 1,
              mb: 1,
              color: "white",
              "&:hover": { background: "#444" }
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}