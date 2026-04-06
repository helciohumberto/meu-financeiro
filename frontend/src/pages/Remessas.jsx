import { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Divider
} from "@mui/material";

export default function Remessas() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState("");

  const [lista, setLista] = useState([]);
  const [total, setTotal] = useState(0);

  const [editId, setEditId] = useState(null);

  const months = [
    "Jan","Fev","Mar","Abr","Mai","Jun",
    "Jul","Ago","Set","Out","Nov","Dez"
  ];

  /* ============================
     SALVAR NOVA REMESSA
     ============================ */
  const salvar = async () => {
    await api.post("/remessas", {
      month,
      year,
      amount: Number(amount)
    });

    limparFormulario();
    carregarTudo();
  };

  /* ============================
     ATUALIZAR REMESSA
     ============================ */
  const atualizar = async () => {
    await api.put(`/remessas/${editId}`, {
      month,
      year,
      amount: Number(amount)
    });

    limparFormulario();
    carregarTudo();
  };

  /* ============================
     DELETAR REMESSA
     ============================ */
  const deletar = async (id) => {
    if (!confirm("Deseja realmente deletar esta remessa?")) return;

    await api.delete(`/remessas/${id}`);
    carregarTudo();
  };

  /* ============================
     EDITAR (CARREGA NO FORM)
     ============================ */
  const editar = (r) => {
    setMonth(r.month);
    setYear(r.year);
    setAmount(r.amount);
    setEditId(r._id);
  };

  /* ============================
     LIMPAR FORMULÁRIO
     ============================ */
  const limparFormulario = () => {
    setAmount("");
    setEditId(null);
  };

  /* ============================
     CARREGAR LISTA E TOTAL
     ============================ */
  const carregarTudo = async () => {
    const res = await api.get(`/remessas/total/${year}`);
    setLista(res.data.remessas);
    setTotal(res.data.total);
  };

  useEffect(() => {
    carregarTudo();
  }, [year]);

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Remessas para o Brasil
      </Typography>

      {/* FORMULÁRIO */}
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
          {months.map((m, i) => (
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
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={editId ? atualizar : salvar}
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

      {/* TOTAL ANUAL */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Typography variant="h6" mb={1}>Total enviado no ano</Typography>
        <Typography variant="h4" fontWeight="bold">
          €{total.toFixed(2)}
        </Typography>
      </Paper>

      {/* LISTA DE REMESSAS */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" mb={2}>Histórico de envios</Typography>

        {lista.length === 0 && (
          <Typography>Nenhuma remessa registrada neste ano.</Typography>
        )}

        {lista.map((r, index) => (
          <Box key={r._id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0"
              }}
            >
              <Typography>
                {months[r.month - 1]} / {r.year} — <strong>€{r.amount}</strong>
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={() => editar(r)}>
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deletar(r._id)}
                >
                  Deletar
                </Button>
              </Box>
            </Box>

            {index < lista.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}