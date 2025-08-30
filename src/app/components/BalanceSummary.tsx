"use client";

interface BalanceSummaryProps {
  income: number;
  expense: number;
  balance: number;
}

export default function BalanceSummary({ income, expense, balance }: BalanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-lg font-semibold text-gray-600">Balance</h2>
        <p className="text-2xl font-bold text-indigo-700">₹{balance}</p>
      </div>
      <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-lg font-semibold text-gray-600">Income</h2>
        <p className="text-2xl font-bold text-green-600">₹{income}</p>
      </div>
      <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-lg font-semibold text-gray-600">Expense</h2>
        <p className="text-2xl font-bold text-red-600">₹{expense}</p>
      </div>
    </div>
  );
}
