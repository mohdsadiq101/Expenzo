"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

// Add 'color' to the props, with a default value
export function RadialProgress({ value, color = "#0ea5e9" }: { value: number; color?: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  const data = [{ name: "progress", value: safeValue }];

  return (
    <ResponsiveContainer width={60} height={60}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="80%"
        outerRadius="100%"
        barSize={6}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          angleAxisId={0}
          fill={color} // Use the color prop here
          cornerRadius={10}
          isAnimationActive={false}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}