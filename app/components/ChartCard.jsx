'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FF69B4', '#C71585'];

export default function ChartCard({ data, title }) {
  return (
    <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-xl shadow-md w-full max-w-sm">
      <h2 className="text-center text-lg font-semibold mb-4 text-pink-700 dark:text-white">{title}</h2>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#FF69B4"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
