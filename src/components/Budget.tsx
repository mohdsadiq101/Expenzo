// src/components/Budget.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransactions } from "@/context/TransactionContext";

export function Budget() {
  const { transactions } = useTransactions();
  const monthlyBudget = 20000.00; // A fixed budget for now (example value in INR)

  // Get current month and year to filter expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate total expenses for the current month
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const percentageUsed = (totalExpenses / monthlyBudget) * 100;
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Card className="mb-6 bg-teal-500 text-white shadow-xl">
      <CardContent>
        <p className="text-lg font-bold mb-1">Monthly Budget</p>
        <Progress value={percentageUsed} className="mb-2 h-3 bg-teal-300 [&>*]:bg-white" />
        <div className="flex justify-between items-center text-md">
          <span>{formatter.format(totalExpenses)} / {formatter.format(monthlyBudget)}</span>
          <span>{percentageUsed.toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}