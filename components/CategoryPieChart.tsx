"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction, Category } from "@/lib/types";

interface CategoryPieChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export function CategoryPieChart({
  transactions,
  categories,
}: CategoryPieChartProps) {
  const categoryData = useMemo(() => {
    const data: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      data[transaction.categoryId] =
        (data[transaction.categoryId] || 0) + transaction.amount;
    });

    return categories
      .map((category) => ({
        name: category.name,
        value: data[category.id] || 0,
        color: category.color,
      }))
      .filter((item) => item.value > 0);
  }, [transactions, categories]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
