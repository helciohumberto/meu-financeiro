import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";

function DonutTooltip({ active, payload, totalValue }) {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  const { category, value, color } = payload[0].payload;
  const pct = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : "0";

  return (
    <Paper
      elevation={0}
      sx={{
        p: "10px 14px",
        minWidth: 155,
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 24px rgba(15,23,42,0.10)"
            : "0 4px 24px rgba(0,0,0,0.55)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color || "#8884d8",
            flexShrink: 0,
          }}
        />
        <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
          {category}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: color || "text.primary", lineHeight: 1.2 }}
      >
        €{Number(value).toFixed(2)}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {pct}% do total
      </Typography>
    </Paper>
  );
}

export default function CategoryPieChart({ data }) {
  const theme = useTheme();
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const legendColor = theme.palette.text.secondary;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={110}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color || "#8884d8"} />
          ))}
        </Pie>
        <Tooltip
          content={<DonutTooltip totalValue={totalValue} />}
          cursor={false}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: legendColor, fontSize: 13 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
