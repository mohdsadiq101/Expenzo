// src/context/TransactionContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction } from '@/types';

// Sample data to get started
const sampleTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 12500.00, category: 'Salary', date: '2025-03-12' },
  { id: '2', type: 'expense', amount: 504.90, category: 'Grocery Store', date: '2025-03-10' },
  { id: '3', type: 'expense', amount: 1005.00, category: 'Rent', date: '2025-03-05' },
];

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // On initial load, try to get transactions from localStorage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // If nothing is stored, use the sample data
      setTransactions(sampleTransactions);
    }
  }, []);

  useEffect(() => {
    // When transactions change, save them to localStorage
    if (transactions.length > 0) { // Only save if there are transactions
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0] };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
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