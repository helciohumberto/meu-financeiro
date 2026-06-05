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
  AccountBalanceWallet,
  Menu as MenuIcon,
  ChevronLeft,
  Send
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

    // ⭐ NOVO ITEM ADICIONADO AQUI
    { label: "Remessas", icon: <Send />, path: "/remessas" },

    { label: "Configurações", icon: <Settings />, path: "/settings" }
  ];

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 240,
        transition: "0.3s ease",
        padding: 2,
        paddingTop: "60px",
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
          justifyContent: collapsed ? "center" : "space-between",
          gap: 1,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                background: (t) =>
                  `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
              }}
            >
              <AccountBalanceWallet fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight={700} noWrap>
              Meu Financeiro
            </Typography>
          </Box>
        )}

        <IconButton onClick={toggleCollapse}>
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Lista de itens */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 1.5,
                  color: active ? "primary.main" : "text.secondary",
                  bgcolor: (t) =>
                    active
                      ? t.palette.mode === "light"
                        ? "rgba(13,148,136,0.10)"
                        : "rgba(13,148,136,0.18)"
                      : "transparent",
                  "&:hover": {
                    bgcolor: (t) =>
                      t.palette.mode === "light"
                        ? "rgba(13,148,136,0.06)"
                        : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}