import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import {
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

export default function Categories() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    color: "#1976d2",
    icon: "Category"
  });

  const [editData, setEditData] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data
  });

  const createMutation = useMutation({
    mutationFn: async () => api.post("/categories", form),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setForm({ name: "", color: "#1976d2", icon: "Category" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["categories"])
  });

  const updateMutation = useMutation({
    mutationFn: async () =>
      api.put(`/categories/${editData._id}`, editData),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditData(null);
    }
  });

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Categorias
      </Typography>

      {/* FORMULÁRIO */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Nome da categoria"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            type="color"
            label="Cor"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Ícone (nome MUI)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
        </Grid>

        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => createMutation.mutate()}
            >
            Criar
          </Button>
        </Grid>
      </Grid>

      {/* LISTAGEM */}
      <Grid container spacing={2}>
        {categories?.map((cat) => (
          <Grid item key={cat._id}>
            <Card sx={{ width: 220 }}>
              <CardContent>
                <Typography variant="h6">{cat.name}</Typography>

                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: cat.color,
                    borderRadius: "50%",
                    marginTop: 10
                  }}
                />

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Ícone: {cat.icon}
                </Typography>

                <Button
                  variant="outlined"
                  sx={{ mt: 2, mr: 1 }}
                  onClick={() => setEditData(cat)}
                  >
                  Editar
                </Button>

                <Button
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => deleteMutation.mutate(cat._id)}
                  >
                  Apagar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={!!editData} onClose={() => setEditData(null)}>
        <DialogTitle>Editar Categoria</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            sx={{ mt: 2 }}
            value={editData?.name || ""}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
            />

          <TextField
            fullWidth
            type="color"
            label="Cor"
            sx={{ mt: 2 }}
            value={editData?.color || "#1976d2"}
            onChange={(e) =>
              setEditData({ ...editData, color: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Ícone"
            sx={{ mt: 2 }}
            value={editData?.icon || ""}
            onChange={(e) =>
              setEditData({ ...editData, icon: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditData(null)}>Cancelar</Button>
          <Button variant="contained" onClick={() => updateMutation.mutate()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
              
  );
}