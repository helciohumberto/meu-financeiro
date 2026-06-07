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
  DialogActions,
  CircularProgress,
  Box,
} from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import { useNotification } from "../hooks/useNotification";

export default function Categories() {
  const queryClient = useQueryClient();
  const { notif, notify, close } = useNotification();

  const [form, setForm] = useState({ name: "", color: "#1976d2", icon: "Category" });
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });

  const createMutation = useMutation({
    mutationFn: () => api.post("/categories", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setForm({ name: "", color: "#1976d2", icon: "Category" });
      notify("Categoria criada com sucesso");
    },
    onError: () => notify("Erro ao criar categoria", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notify("Categoria apagada");
    },
    onError: () => notify("Erro ao apagar categoria", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: () => api.put(`/categories/${editData._id}`, editData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditData(null);
      notify("Categoria atualizada");
    },
    onError: () => notify("Erro ao atualizar categoria", "error"),
  });

  const handleCreate = () => {
    if (!form.name.trim()) {
      notify("O nome da categoria é obrigatório", "warning");
      return;
    }
    createMutation.mutate();
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(confirmDelete.id);
    setConfirmDelete({ open: false, id: null });
  };

  return (
    <Box sx={{ p: 1 }}>
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
            onClick={handleCreate}
            disabled={createMutation.isPending}
            startIcon={
              createMutation.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            Criar
          </Button>
        </Grid>
      </Grid>

      {/* EMPTY STATE */}
      {categories?.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography variant="h6">Nenhuma categoria criada</Typography>
          <Typography variant="body2">
            Crie a primeira categoria acima para começar a organizar as despesas.
          </Typography>
        </Box>
      )}

      {/* LISTAGEM */}
      <Grid container spacing={2}>
        {categories?.map((cat) => (
          <Grid item key={cat._id}>
            <Card sx={{ width: 220 }}>
              <CardContent>
                <Typography variant="h6">{cat.name}</Typography>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    background: cat.color,
                    borderRadius: "50%",
                    mt: 1.5,
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
                  onClick={() => setConfirmDelete({ open: true, id: cat._id })}
                  disabled={deleteMutation.isPending}
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
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <TextField
            fullWidth
            type="color"
            label="Cor"
            sx={{ mt: 2 }}
            value={editData?.color || "#1976d2"}
            onChange={(e) => setEditData({ ...editData, color: e.target.value })}
          />
          <TextField
            fullWidth
            label="Ícone"
            sx={{ mt: 2 }}
            value={editData?.icon || ""}
            onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditData(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            startIcon={
              updateMutation.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRMAÇÃO DE APAGAR */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Apagar categoria"
        message="Tem certeza que deseja apagar esta categoria? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />

      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={close}
      />
    </Box>
  );
}
