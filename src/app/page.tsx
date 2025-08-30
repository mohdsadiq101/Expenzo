"use client";
import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string; // "income" | "expense"
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("income");
  const [type, setType] = useState<"income" | "expense">("expense");

  // filter state
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  // Fetch all transactions
  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add new transaction
  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        amount,
        category,
        type,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error adding transaction:", error.error);
      return;
    }

    const data = await res.json();
    setTransactions([data, ...transactions]);
    setTitle("");
    setAmount("");
    setCategory("");
    setType("expense");
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  // Calculate balances
  const income = transactions
    .filter((t) => t.category === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.category === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // apply filter
  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.category === filter);

  return (
    <main className="min-h-screen p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <h1 className="text-5xl font-bold mb-8 text-center text-indigo-700 drop-shadow">
        Expenzo
      </h1>

      {/* Balance Summary */}
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

      {/* Add Transaction Form */}
      <form
        onSubmit={addTransaction}
        className="mb-8 p-6 bg-white rounded-2xl shadow-lg space-y-4 max-w-lg mx-auto"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 border border-gray-600 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-placeholder="Select Category"
          className="w-full p-3 border border-gray-600 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Add Transaction
        </button>
      </form>
      

      {/* Transactions List */}
      <div className="p-6 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Transactions</h2>
        
        <div className="mb-6 max-w-30">
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
        <ul className="space-y-3">
          {filteredTransactions.map((tx) => (
            <li
              key={tx._id}
              className="flex justify-between items-center p-4 border rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium text-gray-700">{tx.title}</p>
                <p
                  className={`text-lg font-semibold ${
                    tx.category === "expense"
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  ₹{Math.abs(tx.amount)}
                </p>
              </div>
              <button
                onClick={() => deleteTransaction(tx._id)}
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
