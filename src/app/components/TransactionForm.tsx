"use client";
import { useState } from "react";

interface Props {
  onAdd: (
    title: string,
    amount: number,
    category: string,
    type: "income" | "expense",
    description?: string
  ) => void;
  onCancel: () => void;
}

export default function TransactionForm({ onAdd, onCancel }: Props) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    onAdd(title, Number(amount), category, type, description);
    setTitle("");
    setAmount("");
    setCategory("");
    setDescription("");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add Transaction</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>

      {/* Toggle Expense/Income */}
      <div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 py-2 font-medium ${
            type === "expense" ? "bg-indigo-500 text-white" : "text-gray-600"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-2 font-medium ${
            type === "income" ? "bg-indigo-500 text-white" : "text-gray-600"
          }`}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="number"
          placeholder="$0.00"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Transport">Transport</option>
          <option value="Salary">Salary</option>
        </select>

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}
