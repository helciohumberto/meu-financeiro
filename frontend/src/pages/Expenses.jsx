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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

export default function Expenses() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    description: "",
    value: "",
    date: "",
    category: ""
  });

  const [editData, setEditData] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data
  });

  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await api.get("/expenses")).data
  });

  const createMutation = useMutation({
    mutationFn: async () => api.post("/expenses", form),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      setForm({ description: "", value: "", date: "", category: "" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/expenses/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["expenses"])
  });

  const updateMutation = useMutation({
    mutationFn: async () =>
      api.put(`/expenses/${editData._id}`, editData),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      setEditData(null);
    }
  });

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Lançamentos
      </Typography>

      {/* FORMULÁRIO */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            fullWidth
            type="number"
            label="Valor (€)"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            fullWidth
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            select
            label="Categoria"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => createMutation.mutate()}
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>

      {/* LISTAGEM */}
      <Grid container spacing={2}>
        {expenses?.map((exp) => (
          <Grid item key={exp._id}>
            <Card sx={{ width: 260 }}>
              <CardContent>
                <Typography variant="h6">{exp.description}</Typography>
                <Typography>€{exp.value}</Typography>
                <Typography>{new Date(exp.date).toLocaleDateString()}</Typography>
                <Typography>Categoria: {exp.category?.name}</Typography>

                <Button
                  variant="outlined"
                  sx={{ mt: 2, mr: 1 }}
                  onClick={() => setEditData(exp)}
                >
                  Editar
                </Button>

                <Button
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => deleteMutation.mutate(exp._id)}
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
        <DialogTitle>Editar Lançamento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Descrição"
            sx={{ mt: 2 }}
            value={editData?.description || ""}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />

          <TextField
            fullWidth
            type="number"
            label="Valor (€)"
            sx={{ mt: 2 }}
            value={editData?.value || ""}
            onChange={(e) =>
              setEditData({ ...editData, value: e.target.value })
            }
          />

          <TextField
            fullWidth
            type="date"
            sx={{ mt: 2 }}
            value={editData?.date?.substring(0, 10) || ""}
            onChange={(e) =>
              setEditData({ ...editData, date: e.target.value })
            }
          />

          <TextField
            fullWidth
            select
            label="Categoria"
            sx={{ mt: 2 }}
            value={editData?.category?._id || ""}
            onChange={(e) =>
              setEditData({ ...editData, category: e.target.value })
            }
          >
            {categories?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
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