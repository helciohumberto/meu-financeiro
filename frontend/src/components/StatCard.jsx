import { Card, CardContent, Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * Card de métrica enxuto: chip de ícone tingido + rótulo discreto + valor em destaque.
 *
 * @param {string} title    Rótulo da métrica
 * @param {string} value    Valor já formatado
 * @param {node}   icon     Ícone MUI
 * @param {string} color    Cor de destaque (hex)
 * @param {string} [valueColor] Cor opcional para o valor
 */
export default function StatCard({ title, value, icon, color, valueColor }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={{ display: "flex", alignItems: "center", gap: 2, py: 2.5 }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            bgcolor: (t) => alpha(color, t.palette.mode === "light" ? 0.12 : 0.2),
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: valueColor || "text.primary", lineHeight: 1.2 }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
