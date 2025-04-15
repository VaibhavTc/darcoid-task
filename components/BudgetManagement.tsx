"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Category } from "@/lib/types";

interface BudgetManagementProps {
  categories: Category[];
  onUpdateBudget: (categoryId: string, newBudget: number) => void;
  onAddCategory: (category: Omit<Category, "id">) => void;
}

export function BudgetManagement({
  categories,
  onUpdateBudget,
  onAddCategory,
}: BudgetManagementProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    budget: "",
    color: "#000000",
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category.id);
    setNewBudget(category.budget.toString());
  };

  const handleSave = (categoryId: string) => {
    const budget = parseFloat(newBudget);
    if (!isNaN(budget) && budget > 0) {
      onUpdateBudget(categoryId, budget);
      setEditingCategory(null);
      setNewBudget("");
    }
  };

  const handleAddCategory = () => {
    const budget = parseFloat(newCategory.budget);
    if (newCategory.name && !isNaN(budget) && budget > 0) {
      console.log("okass");
      onAddCategory({
        name: newCategory.name,
        budget: budget,
        color: newCategory.color,
      });
      setIsAddingCategory(false);
      setNewCategory({ name: "", budget: "", color: "#000000" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddingCategory(true)}>
          Add New Category
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Monthly Budget</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {editingCategory === category.id ? (
                    <Input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-32 ml-auto"
                      min="0"
                      step="10"
                    />
                  ) : (
                    `$${category.budget.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingCategory === category.id ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSave(category.id)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      Edit Budget
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Budget</label>
              <Input
                type="number"
                value={newCategory.budget}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, budget: e.target.value })
                }
                placeholder="Enter budget amount"
                min="0"
                step="10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Color</label>
              <Input
                type="color"
                value={newCategory.color}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, color: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingCategory(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
