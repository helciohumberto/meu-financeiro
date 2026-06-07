import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import Notification from "../components/Notification";
import { useNotification } from "../hooks/useNotification";

export default function Settings() {
  const queryClient = useQueryClient();
  const { notif, notify, close } = useNotification();

  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/settings")).data,
  });

  const [form, setForm] = useState({ monthlyGoal: "", salary: "" });

  useEffect(() => {
    if (data) setForm({ monthlyGoal: data.monthlyGoal, salary: data.salary });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => api.put("/settings", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      notify("Configurações guardadas");
    },
    onError: () => notify("Erro ao guardar configurações", "error"),
  });

  if (!data) return null;

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Configurações
      </Typography>

      <TextField
        fullWidth
        label="Meta mensal de gastos (€)"
        type="number"
        sx={{ mb: 2 }}
        value={form.monthlyGoal}
        onChange={(e) => setForm({ ...form, monthlyGoal: Number(e.target.value) })}
      />

      <TextField
        fullWidth
        label="Ordenado (€)"
        type="number"
        sx={{ mb: 2 }}
        value={form.salary}
        onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
      />

      <Button
        variant="contained"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        startIcon={
          mutation.isPending ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        Guardar
      </Button>

      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={close}
      />
    </Box>
  );
}
