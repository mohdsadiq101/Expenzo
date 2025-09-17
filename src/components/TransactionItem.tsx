// src/components/TransactionItem.tsx
import { Transaction } from "@/types";
import { Card } from "@/components/ui/card";
import { Banknote, Home, LucideIcon, ShoppingBasket, Trash2 } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import { getCategoryIcon } from "@/lib/icon-map";

// Helper to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Formatter for currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { deleteTransaction } = useTransactions();
  const Icon = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <Card className="p-4 mb-3 pr-3 border border-gray-300 shadow-md">
      <div className="flex items-center">
        <div className="mr-4 bg-slate-100 p-3 rounded-lg">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <div className="flex-grow">
          <p className="text-md font-semibold text-gray-900">{transaction.category}</p>
          <p className="text-sm font-semibold text-gray-400">{formatDate(transaction.date)}</p>
        </div>
        <div className={`mr-1 font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'}{formatter.format(transaction.amount)}
        </div>
        <button
          onClick={() => deleteTransaction?.(transaction.id)}
          className="cursor-pointer text-gray-400 ml-2 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}