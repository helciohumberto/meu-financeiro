import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function BarTooltip({ active, payload, label }) {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value ?? 0;
  const color = theme.palette.secondary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: "10px 14px",
        minWidth: 140,
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 24px rgba(15,23,42,0.10)"
            : "0 4px 24px rgba(0,0,0,0.55)",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
        {label}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color, lineHeight: 1.2 }}
      >
        €{Number(value).toFixed(2)}
      </Typography>
    </Paper>
  );
}

export default function RemessasBarChart({ data }) {
  const theme = useTheme();
  const color = theme.palette.secondary.main;
  const gridColor = theme.palette.divider;
  const tickColor = theme.palette.text.secondary;

  const chartData = MESES.map((mes, i) => ({
    mes,
    amount: data[i]?.amount ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={28}>
        <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="mes"
          tick={{ fill: tickColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: tickColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${v}`}
          width={58}
        />
        <Tooltip
          content={<BarTooltip />}
          cursor={{ fill: alpha(color, 0.06) }}
        />
        <Bar dataKey="amount" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
