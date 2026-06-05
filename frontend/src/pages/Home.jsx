import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  ReceiptLongOutlined,
  FlagOutlined,
  TrendingDownOutlined,
  InsightsOutlined,
  CategoryOutlined,
  ArrowForwardOutlined,
} from "@mui/icons-material";

import StatCard from "../components/StatCard";

const eur = (v) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(v) || 0);

export default function Home() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get("/reports/dashboard")).data,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, margin: "0 auto", mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Meu Financeiro
        </Typography>
        <Typography color="error">
          Erro ao carregar dados. Verifique se o backend está rodando e o MongoDB está conectado.
        </Typography>
      </Box>
    );
  }

  const navCards = [
    {
      title: "Dashboard",
      desc: "Ver gráficos e resumo financeiro",
      icon: <InsightsOutlined />,
      color: "#0d9488",
      path: "/dashboard",
    },
    {
      title: "Lançamentos",
      desc: "Gerir despesas e registos",
      icon: <ReceiptLongOutlined />,
      color: "#2563eb",
      path: "/lancamentos",
    },
    {
      title: "Categorias",
      desc: "Organizar categorias de despesas",
      icon: <CategoryOutlined />,
      color: "#7c3aed",
      path: "/categorias",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Meu Financeiro
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Resumo do mês atual
      </Typography>

      {/* RESUMO DO MÊS */}
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Saldo"
            value={eur(data?.cash)}
            icon={<AccountBalanceWalletOutlined />}
            color="#0d9488"
            valueColor={Number(data?.cash) < 0 ? "error.main" : undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Despesas"
            value={eur(data?.totalMonth)}
            icon={<ReceiptLongOutlined />}
            color="#e11d48"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Meta"
            value={eur(data?.goal)}
            icon={<FlagOutlined />}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Diferença da meta"
            value={eur(data?.remaining)}
            icon={<TrendingDownOutlined />}
            color={Number(data?.remaining) < 0 ? "#e11d48" : "#16a34a"}
            valueColor={
              Number(data?.remaining) < 0 ? "error.main" : "success.main"
            }
          />
        </Grid>
      </Grid>

      {/* NAVEGAÇÃO */}
      <Grid container spacing={2.5}>
        {navCards.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.path}>
            <Card
              onClick={() => navigate(c.path)}
              sx={{
                cursor: "pointer",
                height: "100%",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: c.color,
                },
              }}
            >
              <CardContent sx={{ py: 3 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: c.color,
                    bgcolor: (t) =>
                      t.palette.mode === "light"
                        ? `${c.color}1f`
                        : `${c.color}33`,
                    mb: 2,
                  }}
                >
                  {c.icon}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {c.title}
                  </Typography>
                  <ArrowForwardOutlined
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {c.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
