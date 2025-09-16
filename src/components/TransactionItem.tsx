// src/components/TransactionItem.tsx
import { Transaction } from "@/types";
import { Card } from "@/components/ui/card";
import { Banknote, Home, LucideIcon, ShoppingBasket } from "lucide-react";

// Helper to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper to get an icon based on category
const getCategoryIcon = (category: string): LucideIcon => {
  switch (category.toLowerCase()) {
    case 'salary':
      return Banknote;
    case 'grocery store':
      return ShoppingBasket;
    case 'rent':
      return Home;
    default:
      return Banknote; // A fallback icon
  }
};

// Formatter for currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const Icon = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <Card className="p-4 mb-3">
      <div className="flex items-center">
        <div className="mr-4 bg-slate-100 p-3 rounded-lg">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <div className="flex-grow">
          <p className="text-md font-semibold text-gray-800">{transaction.category}</p>
          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
        </div>
        <div className={`font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'}{formatter.format(transaction.amount)}
        </div>
      </div>
    </Card>
  );
}