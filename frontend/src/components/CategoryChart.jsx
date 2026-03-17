import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#1976d2", "#9c27b0", "#ef5350", "#ffa726", "#66bb6a"];

export default function CategoryChart({ data }) {
  return (
    <PieChart width={350} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}