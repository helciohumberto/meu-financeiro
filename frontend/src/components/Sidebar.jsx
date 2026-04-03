import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Typography
} from "@mui/material";

import {
  Dashboard,
  Home,
  Category,
  Settings,
  ListAlt,
  AccountBalanceWallet,
  Menu as MenuIcon,
  ChevronLeft
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: "Início", icon: <Home />, path: "/" },
    { label: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { label: "Lançamentos", icon: <AccountBalanceWallet />, path: "/lancamentos" },
    { label: "Categorias", icon: <Category />, path: "/categorias" },
    { label: "Configurações", icon: <Settings />, path: "/settings" }
  ];

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 240,
        transition: "0.3s ease",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        color: (theme) => theme.palette.text.primary
      }}
    >
      {/* Header com botão de colapsar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between"
        }}
      >
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold">
            Meu Financeiro
          </Typography>
        )}

        <IconButton onClick={toggleCollapse}>
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Lista de itens */}
      <List>
        {menuItems.map((item) => (
          <Tooltip
            key={item.path}
            title={collapsed ? item.label : ""}
            placement="right"
          >
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                background: isActive(item.path)
                  ? "rgba(255,255,255,0.3)"
                  : "transparent",
                "&:hover": {
                  background: "rgba(255,255,255,0.2)"
                }
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                {item.icon}
              </ListItemIcon>

              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
}