import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress
} from "@mui/material";

export default function Home() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get("/reports/dashboard")).data
  });

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Meu Financeiro
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {/* RESUMO DO MÊS */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ background: "#1976d2", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Total gasto no mês</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    €{data.totalMonth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ background: "#2e7d32", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Meta de gasto total</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    €{data.goal}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ background: "#d32f2f", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Falta para meta de gasto</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    €{data.remaining}
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
        </>
      )}
    </Box>
  );
}