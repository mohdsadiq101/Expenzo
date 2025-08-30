"use client";

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string; // "income" | "expense"
  createdAt?: string;
}

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <ul className="space-y-3">
        {transactions.map((tx) => (
          <li
            key={tx._id}
            className="flex justify-between items-center p-4 border rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-medium text-gray-700">{tx.title}</p>
              <p
                className={`text-lg font-semibold ${
                  tx.category === "expense" ? "text-red-500" : "text-green-600"
                }`}
              >
                ₹{Math.abs(tx.amount)}
              </p>
            </div>
            <button
              onClick={() => onDelete(tx._id)}
              className="text-red-500 hover:text-red-700 text-lg font-bold"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
