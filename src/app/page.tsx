// src/app/page.tsx
import { Header } from "@/components/Header";
import { Balance } from "@/components/Balance";
import { Budget } from "@/components/Budget";
import { TransactionsList } from "@/components/TransactionsList";
import { AddTransactionModal } from "@/components/AddTransactionModal"; // <-- IMPORT

export default function Home() {
  return (
    // Add padding to the bottom (pb-24)
    <main className="max-w-md mx-auto p-4 pb-24">
      <Header />
      <Balance />
      <Budget />
      <TransactionsList />
      <AddTransactionModal /> {/* <-- ADD THE COMPONENT */}
    </main>
  );
}