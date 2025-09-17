// src/components/AddTransactionModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";

export function AddTransactionModal() {
  const { addTransaction } = useTransactions();
  const [open, setOpen] = useState(false);

  // Form state
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const amountNumber = parseFloat(amount);
    if (!amountNumber || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    addTransaction({
      type,
      amount: amountNumber,
      category,
      description,
      date: new Date().toISOString(),
    });

    // Reset form and close modal
    setAmount("");
    setCategory("");
    setDescription("");
    setType("expense");
    setOpen(false);
  };

  const categories = {
    expense: ["Grocery Store", "Rent", "Utilities", "Transport"],
    income: ["Salary", "Freelance", "Bonus"],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
  <Button className="fixed bottom-6 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-teal-500 hover:bg-teal-600 shadow-lg">
    <Plus className="h-8 w-8 text-white size-2xl" />
  </Button>
</DialogTrigger>

      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold">
            Add Transaction
          </DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Toggle buttons for Expense / Income */}
          <div className="flex w-full rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setType("expense")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold ${
                type === "expense"
                  ? "bg-teal-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setType("income")}
              className={`flex-1 rounded-full py-2 text-sm font-medium ${
                type === "income"
                  ? "bg-teal-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-md font-medium">Amount</label>
            <Input
              id="amount"
              type="number"
              placeholder="₹0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 border-b-2 font-medium text-md"
            />
          </div>

          {/* Category select */}
          <div>
            <label className="text-md font-medium">Category</label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories[type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description input */}
          <div>
            <label className="text-md font-medium">
              Description (optional)
            </label>
            <Input
              id="description"
              placeholder="Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Footer with Save button */}
        <div className="mt-4">
          <Button
            onClick={handleSubmit}
            className="w-full rounded-full bg-black text-white hover:bg-gray-900"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
