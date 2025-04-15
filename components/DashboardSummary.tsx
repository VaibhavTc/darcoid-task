"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction, Category } from "@/lib/types";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface DashboardSummaryProps {
  transactions: Transaction[];
  categories: Category[];
}

export function DashboardSummary({ transactions, categories }: DashboardSummaryProps) {
  const summary = useMemo(() => {
    if (!categories.length || !transactions.length) {
      return {
        total: 0,
        topCategory: null,
        overBudgetCategories: [],
      };
    }

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const categorySpending = categories.map((category) => ({
      ...category,
      spent: transactions
        .filter((t) => t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0),
    }));

    const spentCategories = categorySpending.filter(cat => cat.spent > 0);
    const topCategory = spentCategories.length > 0
      ? spentCategories.reduce((max, cat) => (cat.spent > max.spent ? cat : max))
      : null;


    const overBudgetCategories = categorySpending.filter(
      (cat) => cat.spent > cat.budget
    );

    return { total, topCategory, overBudgetCategories };
  }, [transactions, categories]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Total Expenses</h3>
        </div>
        <p className="text-2xl font-bold">${summary.total.toFixed(2)}</p>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Top Category</h3>
        </div>
        {summary.topCategory ? (
          <>
            <p className="text-2xl font-bold">{summary.topCategory.name}</p>
            <p className="text-sm text-muted-foreground">
              ${summary.topCategory.spent.toFixed(2)} spent
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No spending recorded</p>
        )}

      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-medium">Over Budget</h3>
        </div>
        {summary.overBudgetCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">All categories within budget</p>
        ) : (
          <div className="space-y-1">
            {summary.overBudgetCategories.map((cat) => (
              <p key={cat.id} className="text-sm">
                {cat.name}: ${(cat.spent - cat.budget).toFixed(2)} over
              </p>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
