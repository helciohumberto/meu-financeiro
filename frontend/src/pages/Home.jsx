import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Box, Card, CardContent, Typography, Grid,
  CircularProgress, LinearProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AccountBalanceWalletOutlined,
  ReceiptLongOutlined,
  FlagOutlined,
  TrendingDownOutlined,
  InsightsOutlined,
  CategoryOutlined,
  SendOutlined,
  ArrowForwardOutlined,
} from "@mui/icons-material";

import StatCard from "../components/StatCard";
import { eur } from "../utils/format";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function progressColor(pct) {
  if (pct >= 100) return "#e11d48";
  if (pct >= 80)  return "#f59e0b";
  return "#16a34a";
}

function GoalProgress({ total, goal, count }) {
  const pct = goal > 0 ? (total / goal) * 100 : 0;
  const color = progressColor(pct);
  const label =
    pct >= 100
      ? `Meta ultrapassada em ${eur(total - goal)}`
      : `Faltam ${eur(goal - total)} para atingir a meta`;

  return (
    <Card>
      <CardContent sx={{ py: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Progresso da meta mensal
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {count} lançamento{count !== 1 ? "s" : ""} este mês
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ color }}>
            {Math.min(pct, 999).toFixed(0)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(pct, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: (t) => alpha(color, t.palette.mode === "light" ? 0.12 : 0.2),
            "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 4 },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {eur(total)} gastos
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

const NAV_CARDS = [
  {
    title: "Dashboard",
    desc: "Gráficos e resumo financeiro",
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
    title: "Remessas",
    desc: "Registar envios para o Brasil",
    icon: <SendOutlined />,
    color: "#f59e0b",
    path: "/remessas",
  },
  {
    title: "Categorias",
    desc: "Organizar categorias de despesas",
    icon: <CategoryOutlined />,
    color: "#7c3aed",
    path: "/categorias",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const now = new Date();
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

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

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* SAUDAÇÃO */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em">
          {greeting()}, Hélcio
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          {monthLabel} · aqui está o resumo do mês
        </Typography>
      </Box>

      {/* STATS */}
      <Grid container spacing={2.5} mb={3}>
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
            valueColor={Number(data?.remaining) < 0 ? "error.main" : "success.main"}
          />
        </Grid>
      </Grid>

      {/* PROGRESSO DA META */}
      <Box mb={4}>
        <GoalProgress
          total={data?.totalMonth ?? 0}
          goal={data?.goal ?? 0}
          count={data?.expenseCount ?? 0}
        />
      </Box>

      {/* NAVEGAÇÃO */}
      <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1.5}>
        Acesso rápido
      </Typography>
      <Grid container spacing={2}>
        {NAV_CARDS.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.path}>
            <Card
              onClick={() => navigate(c.path)}
              sx={{
                cursor: "pointer",
                height: "100%",
                transition: "transform .18s ease, border-color .18s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  borderColor: c.color,
                },
              }}
            >
              <CardContent sx={{ py: 2.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: c.color,
                    bgcolor: (t) => alpha(c.color, t.palette.mode === "light" ? 0.10 : 0.18),
                    mb: 1.5,
                  }}
                >
                  {c.icon}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {c.title}
                  </Typography>
                  <ArrowForwardOutlined fontSize="small" sx={{ color: "text.disabled" }} />
                </Box>
                <Typography variant="body2" color="text.secondary" mt={0.25}>
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
