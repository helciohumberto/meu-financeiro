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
  DialogActions,
  CircularProgress,
  Box,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import { useNotification } from "../hooks/useNotification";

const ITEMS_PER_PAGE = 8;

export default function Expenses() {
  const queryClient = useQueryClient();
  const { notif, notify, close } = useNotification();

  const [form, setForm] = useState({ description: "", value: "", date: "", category: "" });
  const [editData, setEditData] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });

  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await api.get("/expenses")).data,
  });

  const createMutation = useMutation({
    mutationFn: () => api.post("/expenses", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setForm({ description: "", value: "", date: "", category: "" });
      notify("Lançamento adicionado");
    },
    onError: () => notify("Erro ao adicionar lançamento", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      notify("Lançamento apagado");
    },
    onError: () => notify("Erro ao apagar lançamento", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: () => api.put(`/expenses/${editData._id}`, editData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setEditData(null);
      notify("Lançamento atualizado");
    },
    onError: () => notify("Erro ao atualizar lançamento", "error"),
  });

  const handleCreate = () => {
    if (!form.description.trim()) {
      notify("A descrição é obrigatória", "warning");
      return;
    }
    if (!form.value || Number(form.value) <= 0) {
      notify("O valor deve ser maior que zero", "warning");
      return;
    }
    createMutation.mutate();
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(confirmDelete.id);
    setConfirmDelete({ open: false, id: null });
  };

  const resetFilters = () => {
    setSearch("");
    setFilterCategory("");
    setSortBy("");
    setPage(1);
  };

  // 1) Filtrar por pesquisa + categoria
  const filtered = (expenses || []).filter((exp) => {
    const matchCat = filterCategory ? exp.category?._id === filterCategory : true;
    const matchSearch = search
      ? exp.description?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  // 2) Ordenar
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "valueAsc":     return Number(a.value) - Number(b.value);
      case "valueDesc":    return Number(b.value) - Number(a.value);
      case "dateAsc":      return new Date(a.date) - new Date(b.date);
      case "dateDesc":     return new Date(b.date) - new Date(a.date);
      case "categoryAsc":  return (a.category?.name || "").localeCompare(b.category?.name || "");
      case "categoryDesc": return (b.category?.name || "").localeCompare(a.category?.name || "");
      default: return 0;
    }
  });

  // 3) Paginar
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Lançamentos
      </Typography>


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
            <MenuItem value="">Selecione...</MenuItem>
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
            onClick={handleCreate}
            disabled={createMutation.isPending}
            startIcon={
              createMutation.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
            sx={{ height: "100%" }}
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>


      <Grid container spacing={2} mb={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Pesquisar descrição"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            select
            label="Filtrar por categoria"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Todas</MenuItem>
            {categories?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            select
            label="Ordenar por"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Padrão</MenuItem>
            <MenuItem value="valueAsc">Valor (menor → maior)</MenuItem>
            <MenuItem value="valueDesc">Valor (maior → menor)</MenuItem>
            <MenuItem value="dateAsc">Data (mais antiga → nova)</MenuItem>
            <MenuItem value="dateDesc">Data (mais nova → antiga)</MenuItem>
            <MenuItem value="categoryAsc">Categoria (A → Z)</MenuItem>
            <MenuItem value="categoryDesc">Categoria (Z → A)</MenuItem>
          </TextField>
        </Grid>
        {(search || filterCategory || sortBy) && (
          <Grid item xs={12} sm={2}>
            <Button onClick={resetFilters} variant="outlined" fullWidth>
              Limpar filtros
            </Button>
          </Grid>
        )}
      </Grid>


      {sorted.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography variant="h6">
            {expenses?.length === 0
              ? "Nenhum lançamento registado"
              : "Nenhum resultado para os filtros aplicados"}
          </Typography>
          {expenses?.length === 0 ? (
            <Typography variant="body2">Adicione o primeiro lançamento acima.</Typography>
          ) : (
            <Button onClick={resetFilters} sx={{ mt: 1 }}>
              Limpar filtros
            </Button>
          )}
        </Box>
      )}


      <Grid container spacing={2}>
        {paginated.map((exp) => (
          <Grid item key={exp._id}>
            <Card sx={{ width: 260 }}>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {exp.description}
                </Typography>
                <Typography>€{Number(exp.value).toFixed(2)}</Typography>
                <Typography>
                  {new Date(exp.date).toLocaleDateString("pt-PT")}
                </Typography>
                <Typography color="text.secondary">
                  {exp.category?.name || "Sem categoria"}
                </Typography>
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
                  onClick={() => setConfirmDelete({ open: true, id: exp._id })}
                  disabled={deleteMutation.isPending}
                >
                  Apagar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


      {sorted.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Anterior
          </Button>
          <Typography variant="body2" color="text.secondary">
            Página {page} de {totalPages}
          </Typography>
          <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Próxima
          </Button>
        </Box>
      )}


      <Dialog open={!!editData} onClose={() => setEditData(null)}>
        <DialogTitle>Editar Lançamento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Descrição"
            sx={{ mt: 2 }}
            value={editData?.description || ""}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
          <TextField
            fullWidth
            type="number"
            label="Valor (€)"
            sx={{ mt: 2 }}
            value={editData?.value || ""}
            onChange={(e) => setEditData({ ...editData, value: e.target.value })}
          />
          <TextField
            fullWidth
            type="date"
            sx={{ mt: 2 }}
            value={editData?.date?.substring(0, 10) || ""}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
          />
          <TextField
            fullWidth
            select
            label="Categoria"
            sx={{ mt: 2 }}
            value={editData?.category?._id || ""}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
          >
            <MenuItem value="">Selecione...</MenuItem>
            {categories?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
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


      <ConfirmDialog
        open={confirmDelete.open}
        title="Apagar lançamento"
        message="Tem certeza que deseja apagar este lançamento?"
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
