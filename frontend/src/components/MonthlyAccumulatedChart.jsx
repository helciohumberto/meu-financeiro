import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";

function AccumulatedTooltip({ active, payload, label }) {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  const { cumulative, total } = payload[0].payload;
  const isOver = cumulative > payload[0].payload.goal;

  return (
    <Paper
      elevation={0}
      sx={{
        p: "10px 14px",
        minWidth: 160,
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 24px rgba(15,23,42,0.10)"
            : "0 4px 24px rgba(0,0,0,0.55)",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
        Dia {label}
      </Typography>
      {total > 0 && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          Hoje: €{Number(total).toFixed(2)}
        </Typography>
      )}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          color: isOver ? theme.palette.error.main : theme.palette.primary.main,
          lineHeight: 1.2,
        }}
      >
        €{Number(cumulative).toFixed(2)}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        acumulado
      </Typography>
    </Paper>
  );
}

export default function MonthlyAccumulatedChart({ days = [], goal = 0 }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const warning = theme.palette.warning.main;
  const gridColor = theme.palette.divider;
  const tickColor = theme.palette.text.secondary;

  // Calcula o acumulado dia a dia e filtra dias sem movimento no futuro
  const now = new Date();
  const isCurrentMonth =
    days.length > 0 &&
    days.length === new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  let acc = 0;
  const chartData = days
    .map((d) => {
      acc += d.total;
      return { day: d.day, total: d.total, cumulative: acc, goal };
    })
    .filter((d) => {
      if (!isCurrentMonth) return true;
      return d.day <= now.getDate();
    });

  const maxValue = Math.max(goal * 1.1, acc * 1.05, 1);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primary} stopOpacity={0.18} />
            <stop offset="95%" stopColor={primary} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />

        <XAxis
          dataKey="day"
          tick={{ fill: tickColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
          interval={4}
        />
        <YAxis
          domain={[0, maxValue]}
          tick={{ fill: tickColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${v}`}
          width={58}
        />

        <Tooltip content={<AccumulatedTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />

        {goal > 0 && (
          <ReferenceLine
            y={goal}
            stroke={warning}
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: `Meta €${goal}`,
              position: "insideTopRight",
              fill: warning,
              fontSize: 11,
              fontWeight: 600,
              dy: -6,
            }}
          />
        )}

        <Area
          type="monotone"
          dataKey="cumulative"
          stroke={primary}
          strokeWidth={2.5}
          fill="url(#accGradient)"
          dot={false}
          activeDot={{ r: 6, fill: primary, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
