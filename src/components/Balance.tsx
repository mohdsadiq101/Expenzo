// src/components/Balance.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionContext";

export function Balance() {
  const { transactions } = useTransactions();

  // Calculate the total balance
  const balance = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      return acc + transaction.amount;
    }
    return acc - transaction.amount;
  }, 0);

  // Formatter for currency (INR)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <Card className="mb-6">
     <CardContent className="pt-0 pb-0">
      <p className="text-md font-semibold text-gray-500 mb-1">Current Balance</p>
      <div className="text-3xl font-bold text-gray-800">
        {formatter.format(balance)}
      </div>
     </CardContent>
    </Card>
  );
}