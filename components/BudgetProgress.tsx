"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Transaction, Category, CategorySummary } from "@/lib/types";

interface BudgetProgressProps {
  transactions: Transaction[];
  categories: Category[];
}

export function BudgetProgress({
  transactions,
  categories,
}: BudgetProgressProps) {
  console.log("transactions", transactions);
  console.log("categories", categories);
  const categorySummaries = useMemo(() => {
    const summaries: CategorySummary[] = categories.map((category) => {
      const totalSpent = transactions
        .filter((t) => t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        categoryId: category.id,
        totalSpent,
        budget: category.budget,
        percentage: (totalSpent / category.budget) * 100,
      };
    });

    return summaries;
  }, [transactions, categories]);

  return (
    <div className="space-y-6">
      {categorySummaries.map((summary) => {
        const category = categories.find((c) => c.id === summary.categoryId)!;
        const isOverBudget = summary.percentage > 100;
        return (
          <div key={category.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ${summary.totalSpent.toFixed(2)} / ${summary.budget.toFixed(2)}
              </span>
            </div>
            <Progress
              value={Math.min(summary.percentage, 100)}
              className="h-2"
              style={{
                backgroundColor: `${category.color}33`,
              }}
              // indicatorStyle={{
              //   backgroundColor: isOverBudget ? 'hsl(var(--destructive))' : category.color,
              // }}
            />
            <div className="flex justify-between text-sm">
              <span
                className={
                  isOverBudget
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                }
              >
                {summary.percentage.toFixed(0)}% spent
              </span>
              <span
                className={
                  isOverBudget
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                }
              >
                {isOverBudget
                  ? `$${(summary.totalSpent - summary.budget).toFixed(2)} over budget`
                  : `$${(summary.budget - summary.totalSpent).toFixed(2)} remaining`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
