import { useState, useEffect } from "react";
import { api } from "../services/api";
import { getExchangeRate } from "../services/exchange";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { eur, brl } from "../utils/format";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import { useNotification } from "../hooks/useNotification";

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export default function Remessas() {
  const { notif, notify, close } = useNotification();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState("");
  const [lista, setLista] = useState([]);
  const [total, setTotal] = useState(0);
  const [editId, setEditId] = useState(null);
  const [rate, setRate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const carregarTudo = async () => {
    const res = await api.get(`/remessas/total/${year}`);
    setLista(res.data.remessas);
    setTotal(res.data.total);
  };

  useEffect(() => { carregarTudo(); }, [year]);

  useEffect(() => {
    getExchangeRate()
      .then((data) => setRate(data?.rates?.BRL ?? null))
      .catch(() => setRate(null));
  }, []);

  const limparFormulario = () => {
    setAmount("");
    setEditId(null);
  };

  const salvar = async () => {
    setSaving(true);
    try {
      await api.post("/remessas", { month, year, amount: Number(amount), rate });
      limparFormulario();
      await carregarTudo();
      notify("Remessa registada com sucesso");
    } catch {
      notify("Erro ao registar remessa", "error");
    } finally {
      setSaving(false);
    }
  };

  const atualizar = async () => {
    setSaving(true);
    try {
      await api.put(`/remessas/${editId}`, { month, year, amount: Number(amount), rate });
      limparFormulario();
      await carregarTudo();
      notify("Remessa atualizada");
    } catch {
      notify("Erro ao atualizar remessa", "error");
    } finally {
      setSaving(false);
    }
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/remessas/${id}`);
      await carregarTudo();
      notify("Remessa apagada");
    } catch {
      notify("Erro ao apagar remessa", "error");
    }
  };

  const editar = (r) => {
    setMonth(r.month);
    setYear(r.year);
    setAmount(r.amount);
    setEditId(r._id);
  };

  const totalBRL = lista.reduce(
    (sum, r) => sum + (r.rate ? r.amount * r.rate : 0),
    0
  );

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Remessas para o Brasil
      </Typography>


      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Typography variant="h6" mb={2}>
          {editId ? "Editar envio" : "Registrar envio"}
        </Typography>

        <TextField
          fullWidth
          select
          label="Mês"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          sx={{ mb: 2 }}
        >
          {MONTHS.map((m, i) => (
            <MenuItem key={i} value={i + 1}>{m}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Ano"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Valor enviado (€)"
          type="number"
          value={amount}
          error={amount !== "" && Number(amount) <= 0}
          helperText={
            amount !== "" && Number(amount) <= 0 ? "O valor deve ser maior que zero." : ""
          }
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 1 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {rate
            ? Number(amount) > 0
              ? `≈ ${brl(Number(amount) * rate)} (cotação 1 € = ${brl(rate)})`
              : `Cotação atual: 1 € = ${brl(rate)}`
            : "Cotação indisponível no momento"}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={editId ? atualizar : salvar}
            disabled={saving || !amount || Number(amount) <= 0}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {editId ? "Atualizar" : "Salvar"}
          </Button>
          {editId && (
            <Button variant="outlined" color="warning" onClick={limparFormulario}>
              Cancelar edição
            </Button>
          )}
        </Box>
      </Paper>


      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Typography variant="h6" mb={1}>Total enviado no ano</Typography>
        <Typography variant="h4" fontWeight="bold">{eur(total)}</Typography>
        {totalBRL > 0 && (
          <Typography variant="body2" color="text.secondary">
            ≈ {brl(totalBRL)} recebidos no Brasil
          </Typography>
        )}
      </Paper>


      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" mb={2}>Histórico de envios</Typography>

        {lista.length === 0 && (
          <Typography color="text.secondary">
            Nenhuma remessa registada neste ano.
          </Typography>
        )}

        {lista.map((r, index) => (
          <Box key={r._id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
              }}
            >
              <Box>
                <Typography>
                  {MONTHS[r.month - 1]} / {r.year} —{" "}
                  <strong>{eur(r.amount)}</strong>
                </Typography>
                {r.rate && (
                  <Typography variant="body2" color="text.secondary">
                    ≈ {brl(r.amount * r.rate)} · 1 € = {brl(r.rate)}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={() => editar(r)}>Editar</Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setConfirmDelete({ open: true, id: r._id })}
                >
                  Deletar
                </Button>
              </Box>
            </Box>
            {index < lista.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>


      <ConfirmDialog
        open={confirmDelete.open}
        title="Apagar remessa"
        message="Tem certeza que deseja apagar esta remessa?"
        onConfirm={() => {
          deletar(confirmDelete.id);
          setConfirmDelete({ open: false, id: null });
        }}
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
