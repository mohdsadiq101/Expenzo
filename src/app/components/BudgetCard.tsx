"use client";

interface BudgetCardProps {
  spentThisMonth: number;
  monthlyBudget: number;
  budgetPercent: number;
}

export default function BudgetCard({ spentThisMonth, monthlyBudget, budgetPercent }: BudgetCardProps) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-600">Monthly Budget</p>
          <p className="text-xl font-semibold text-gray-800">
            ₹{spentThisMonth.toLocaleString()} / ₹{monthlyBudget.toLocaleString()}
          </p>
        </div>
        <div className="text-sm text-gray-600">{budgetPercent}%</div>
      </div>

      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
        <div
          className="h-3 rounded-full bg-teal-500"
          style={{ width: `${budgetPercent}%` }}
        />
      </div>
    </div>
  );
}
