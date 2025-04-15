export type Category = {
  id: string;
  name: string;
  color: string;
  budget: number;
};

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
}

export interface CategorySummary {
  categoryId: string;
  totalSpent: number;
  budget: number;
  percentage: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "groceries", name: "Groceries", color: "hsl(var(--chart-1))", budget: 500 },
  { id: "utilities", name: "Utilities", color: "hsl(var(--chart-2))", budget: 300 },
  { id: "entertainment", name: "Entertainment", color: "hsl(var(--chart-3))", budget: 200 },
  { id: "transport", name: "Transport", color: "hsl(var(--chart-4))", budget: 150 },
  { id: "other", name: "Other", color: "hsl(var(--chart-5))", budget: 250 },
];