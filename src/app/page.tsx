"use client";
import { useEffect, useState } from "react";
import BalanceSummary from "./components/BalanceSummary";
import BudgetCard from "./components/BudgetCard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string; // "income" | "expense"
  createdAt?: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [showForm, setShowForm] = useState(false);

  const monthlyBudget = 2000; // default budget

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add new transaction
  const addTransaction = async (
    title: string,
    amount: number,
    category: string,
    type: "income" | "expense",
    description?: string
  ) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category, type, description }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error adding transaction:", error.error);
      return;
    }

    const data = await res.json();
    setTransactions([data, ...transactions]);
    setShowForm(false); // close form after adding
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  // Balances
  const income = transactions
    .filter((t) => t.category === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.category === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // Filters
  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.category === filter);

  // Budget % (expenses only)
  const spentThisMonth = transactions
    .filter((t) => t.category === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const budgetPercent =
    monthlyBudget > 0
      ? Math.min(100, Math.round((spentThisMonth / monthlyBudget) * 100))
      : 0;

  const recent = transactions.slice(0, 3);

  return (
    <main className="min-h-screen p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Header / Greeting */}
      <header className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-indigo-700 drop-shadow">Expenzo</h1>
          <p className="text-sm text-gray-600">Track. Save. Grow.</p>
        </div>
      </header>

      {/* Summary */}
      <section className="max-w-2xl mx-auto mb-8 space-y-6">
        <BalanceSummary income={income} expense={expense} balance={balance} />
        <BudgetCard
          spentThisMonth={spentThisMonth}
          monthlyBudget={monthlyBudget}
          budgetPercent={budgetPercent}
        />
      </section>

      {/* Toggle Add Form */}
      <div className="text-center my-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            + Add Transaction
          </button>
        ) : (
          <TransactionForm
            onAdd={addTransaction}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      {/* Transactions */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-700">Transactions</h2>

          <div className="w-40">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "income" | "expense")
              }
              className="w-full p-3 border border-gray-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="grid gap-3">
          {recent.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-700">{tx.title}</p>
                <p className="text-sm text-gray-500">
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    tx.category === "expense" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  ₹{Math.abs(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Full List */}
        <TransactionList
          transactions={filteredTransactions}
          onDelete={deleteTransaction}
        />
      </div>
    </main>
  );
}
