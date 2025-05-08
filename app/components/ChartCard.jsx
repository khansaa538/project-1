import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ChartCard({ completedCount, totalCount }) {
  const chartData = [
    { name: "Selesai", value: completedCount },
    { name: "Belum Selesai", value: totalCount - completedCount },
  ];

  const COLORS = ["#34d399", "#f87171"];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Statistik</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
