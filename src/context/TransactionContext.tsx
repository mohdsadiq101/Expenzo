// src/context/TransactionContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction } from '@/types';

// Let's start with an empty array now that the app is functional
const initialTransactions: Transaction[] = [];

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  budget: number; // <-- NEW: Add budget to our context type
  setBudget: (amount: number) => void; // <-- NEW: Add a function to update it
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budget, setBudget] = useState<number>(10000); // <-- NEW: State for budget, using your default

  // Effect for loading data from localStorage on initial render
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    // NEW: Load budget from localStorage
    const storedBudget = localStorage.getItem('budget');
    if (storedBudget) {
      setBudget(JSON.parse(storedBudget));
    }
  }, []);

  // Effect for saving data to localStorage whenever it changes
  useEffect(() => {
    // Only run this effect after the initial load to prevent overwriting
    if (transactions.length > 0 || localStorage.getItem('transactions')) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    if (budget !== 10000 || localStorage.getItem('budget')) {
      localStorage.setItem('budget', JSON.stringify(budget)); // <-- NEW: Save budget on change
    }
  }, [transactions, budget]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0] };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // The setBudget function is just a wrapper around the state setter
  const handleSetBudget = (amount: number) => {
    setBudget(amount);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, budget, setBudget: handleSetBudget }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};