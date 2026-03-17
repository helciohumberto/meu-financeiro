import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function Settings() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/settings")).data
  });

  const [form, setForm] = useState({
    monthlyGoal: "",
    salary: ""
  });

  useEffect(() => {
    if (data) {
      setForm({
        monthlyGoal: data.monthlyGoal,
        salary: data.salary
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => api.put("/settings", form),
    onSuccess: () => queryClient.invalidateQueries(["settings"])
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

      <Button variant="contained" onClick={() => mutation.mutate()}>
        Guardar
      </Button>
    </Box>
  );
}