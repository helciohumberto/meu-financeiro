import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RemessasBarChart({ data }) {
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  return (
    <Bar
      data={{
        labels: meses,
        datasets: [
          {
            label: "Envios (€)",
            data: data.map((m) => m.amount),
            backgroundColor: "rgba(25,118,210,0.6)",
            borderColor: "#1976d2",
            borderWidth: 2,
          }
        ]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }}
    />
  );
}