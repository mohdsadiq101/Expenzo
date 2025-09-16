// src/components/TransactionsList.tsx
'use client';

import { useTransactions } from "@/context/TransactionContext";
import { TransactionItem } from "./TransactionItem";

export function TransactionsList() {
  const { transactions } = useTransactions();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
      <div>
        {transactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}