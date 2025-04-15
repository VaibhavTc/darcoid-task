"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { BudgetProgress } from "@/components/BudgetProgress";
import { DashboardSummary } from "@/components/DashboardSummary";
import { BudgetManagement } from "@/components/BudgetManagement";
import { Transaction, Category } from "@/lib/types";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/seed").then(() => {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data));
    });

    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    console.log("transaction", transaction);
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    console.log("response", response);
    const newTransaction = await response.json();
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const editTransaction = async (updatedTransaction: Transaction) => {
    const response = await fetch(`/api/transactions/${updatedTransaction.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTransaction),
    });
    const updated = await response.json();
    setTransactions(
      transactions.map((t) => (t.id === updated.id ? updated : t)),
    );
  };

  const updateBudget = async (categoryId: string, newBudget: number) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ budget: newBudget }),
    });
    const updated = await response.json();
    setCategories(
      categories.map((category) =>
        category.id === updated.id ? updated : category,
      ),
    );
  };

  const addCategory = async (newCategory: Omit<Category, "id">) => {
    console.log("newCategory", newCategory);
    console.log("json", JSON.stringify(newCategory));
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    });
    console.log("response", response);
    const category = await response.json();
    setCategories([...categories, category]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Personal Finance Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your expenses and visualize your spending patterns
          </p>
        </div>

        <DashboardSummary transactions={transactions} categories={categories} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
            <TransactionForm
              onSubmit={addTransaction}
              categories={categories}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Budget Progress</h2>
            <BudgetProgress
              transactions={transactions}
              categories={categories}
            />
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Manage Category Budgets
          </h2>
          <BudgetManagement
            categories={categories}
            onUpdateBudget={updateBudget}
            onAddCategory={addCategory}
          />
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Monthly Expenses</h2>
            <MonthlyExpensesChart transactions={transactions} />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Spending by Category
            </h2>
            <CategoryPieChart
              transactions={transactions}
              categories={categories}
            />
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={editTransaction}
            categories={categories}
          />
        </Card>
      </div>
    </div>
  );
}
