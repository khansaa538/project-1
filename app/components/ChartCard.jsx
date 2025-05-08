"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#4F46E5", "#10B981"];

export default function ChartCard({ title, value, completed }) {
  const data = [
    { name: "Selesai", value: completed },
    { name: "Belum Selesai", value: value - completed },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 w-full sm:w-1/2 md:w-1/3 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <PieChart width={120} height={120}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={50}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <div className="mt-2 text-center dark:text-gray-300">
        <p className="text-sm">
          Selesai: {completed} / {value}
        </p>
      </div>
    </div>
  );
}
