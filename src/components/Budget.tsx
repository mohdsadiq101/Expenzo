// src/components/Budget.tsx
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransactions } from "@/context/TransactionContext";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

export function Budget() {
  const { transactions, budget, setBudget } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(String(budget));

  const now = new Date();
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
    .reduce((acc, t) => acc + t.amount, 0);

  const percentageUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handleSave = () => {
    const amount = parseFloat(newBudget);
    if (!isNaN(amount) && amount >= 0) {
      setBudget(amount);
      setIsEditing(false);
    }
  };
  
  // Update the local input state when the global budget changes
  useEffect(() => {
    setNewBudget(String(budget));
  }, [budget]);

  return (
    <Card className="mb-6 border border-teal-500 bg-teal-500 text-white shadow-xl">
      <CardContent className="pt-0 pb-0">
        <div className="flex justify-between items-center mb-1">
          <p className="text-lg font-bold">Monthly Budget</p>
          {!isEditing && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-teal-600 hover:text-white" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Progress value={percentageUsed} className="mb-2 h-3 bg-teal-300 [&>*]:bg-white" />
        <div className="flex justify-between items-center text-md">
          <div className="flex items-center gap-1">
          <span>{formatter.format(totalExpenses)} / </span>
            {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="h-8 max-w-[120px] bg-teal-600 border-teal-400 text-white text-md"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              />
              <Button onClick={handleSave} size="sm" className="bg-white font-semibold text-teal-500 hover:bg-gray-200">Save</Button>
            </div>
          ) : (
            <span>{formatter.format(budget)}</span>
          )}
          </div>
          <span>{percentageUsed.toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}