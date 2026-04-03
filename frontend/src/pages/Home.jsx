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

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Meu Financeiro
      </Typography>

      {/* RESUMO DO MÊS */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#00897b", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Saldo</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{Number(data?.cash || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#1976d2", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Despesas</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{Number(data?.totalMonth || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#2e7d32", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Meta</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{Number(data?.goal || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: "#d32f2f", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Diferença da meta</Typography>
              <Typography variant="h4" fontWeight="bold">
                €{Number(data?.remaining || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* NAVEGAÇÃO */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Dashboard
              </Typography>
              <Typography>Ver gráficos e resumo financeiro</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/lancamentos")}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Lançamentos
              </Typography>
              <Typography>Gerir despesas e registos</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/categorias")}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Categorias
              </Typography>
              <Typography>Organizar categorias de despesas</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
