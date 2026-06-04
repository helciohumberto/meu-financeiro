import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import RemessasBarChart from "../components/RemessasBarChart";
import { getExchangeRate } from "../services/exchange";

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
  console.log("exchange:", exchange);

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
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#00897b", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Saldo</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{Number(data.cash || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#1976d2", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Despesas</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{data.totalMonth.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#2e7d32", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Meta</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{data.goal.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#6a1b9a", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Salário</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{Number(data.salary || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#d32f2f", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Diferença da meta</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{data.remaining.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ⭐ TOTAL ENVIADO NO MÊS */}
        {/* ⭐ TOTAL ENVIADO NO MÊS */}
<Grid item xs={12} md={4}>
  <Card sx={{ background: "#ff6f00", color: "white" }}>
    <CardContent>
      <Typography variant="h6">Enviado para o Brasil</Typography>

      <Typography variant="h4" fontWeight="bold">
        €{Number(data.totalEnviadoMes || 0).toFixed(2)}
      </Typography>
    </CardContent>
  </Card>
</Grid>
      </Grid>

      {/* GRÁFICOS */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={2}>
            Gastos por categoria
          </Typography>
          <CategoryPieChart data={data.byCategory || []} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={2}>
            Evolução mensal
          </Typography>
          <MonthlyLineChart data={data.monthly || []} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={2}>
            Remessas para o Brasil (ano)
          </Typography>
          <RemessasBarChart data={graficoRemessas || []} />
        </Grid>
      </Grid>
    </Box>
  );
}