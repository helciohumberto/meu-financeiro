import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";

function LineTooltip({ active, payload, label }) {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value ?? 0;

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
        sx={{ color: theme.palette.primary.main, lineHeight: 1.2 }}
      >
        €{Number(value).toFixed(2)}
      </Typography>
    </Paper>
  );
}

export default function MonthlyLineChart({ data }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const gridColor = theme.palette.divider;
  const tickColor = theme.palette.text.secondary;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primary} stopOpacity={0.18} />
            <stop offset="95%" stopColor={primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="month"
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
          content={<LineTooltip />}
          cursor={{ stroke: gridColor, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={primary}
          strokeWidth={2.5}
          fill="url(#monthlyGradient)"
          dot={{ r: 4, fill: primary, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: primary, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
