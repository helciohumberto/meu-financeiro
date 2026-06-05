import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  ReceiptLongOutlined,
  FlagOutlined,
  PaymentsOutlined,
  TrendingDownOutlined,
  SendOutlined,
} from "@mui/icons-material";

import StatCard from "../components/StatCard";
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import RemessasBarChart from "../components/RemessasBarChart";
import { getExchangeRate } from "../services/exchange";

const eur = (v) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(v) || 0);

export default function Dashboard() {
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    category: "",
  });

  // 🔹 Dashboard principal
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", filters],
    queryFn: async () =>
      (await api.get("/reports/dashboard", { params: filters })).data,
  });

  // 🔹 Categorias
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });

  // 🔹 Gráfico de remessas
  const { data: graficoRemessas } = useQuery({
    queryKey: ["graficoRemessas", filters.year],
    queryFn: async () =>
      (await api.get(`/remessas/grafico/${filters.year}`)).data,
  });

  // 🔹 Câmbio EUR → BRL (API nova)
  const { data: exchange } = useQuery({
    queryKey: ["exchangeRate"],
    queryFn: getExchangeRate,
  });

  // 🔹 Conversão sem taxa
  const converterParaBRL = (valorEuro) => {
    if (!exchange?.rates?.BRL) return null;
    return valorEuro * exchange.rates.BRL;
  };

  // 🔹 Loading geral
  if (isLoading || !data) {
    return (
      <Box sx={{ padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      {/* FILTROS */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Mês"
            value={filters.month}
            onChange={(e) =>
              setFilters({ ...filters, month: Number(e.target.value) })
            }
          >
            {months.map((m, i) => (
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Ano"
            type="number"
            value={filters.year}
            onChange={(e) =>
              setFilters({ ...filters, year: Number(e.target.value) })
            }
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Categoria"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <MenuItem value="">Todas</MenuItem>
            {categories?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* CARDS RESUMO */}
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Saldo"
            value={eur(data.cash)}
            icon={<AccountBalanceWalletOutlined />}
            color="#0d9488"
            valueColor={Number(data.cash) < 0 ? "error.main" : undefined}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Despesas"
            value={eur(data.totalMonth)}
            icon={<ReceiptLongOutlined />}
            color="#e11d48"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Meta"
            value={eur(data.goal)}
            icon={<FlagOutlined />}
            color="#2563eb"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Salário"
            value={eur(data.salary)}
            icon={<PaymentsOutlined />}
            color="#7c3aed"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Diferença da meta"
            value={eur(data.remaining)}
            icon={<TrendingDownOutlined />}
            color={Number(data.remaining) < 0 ? "#e11d48" : "#16a34a"}
            valueColor={Number(data.remaining) < 0 ? "error.main" : "success.main"}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Enviado para o Brasil"
            value={eur(data.totalEnviadoMes)}
            icon={<SendOutlined />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* GRÁFICOS */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Typography variant="h6" mb={2}>
              Gastos por categoria
            </Typography>
            <CategoryPieChart data={data.byCategory || []} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Typography variant="h6" mb={2}>
              Evolução mensal
            </Typography>
            <MonthlyLineChart data={data.monthly || []} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Typography variant="h6" mb={2}>
              Remessas para o Brasil (ano)
            </Typography>
            <RemessasBarChart data={graficoRemessas || []} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}