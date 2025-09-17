// src/app/analytics/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { Card } from '@/components/ui/card';
import { RadialProgress } from '@/components/ui/radial-progress';
import { getCategoryIcon } from '@/lib/icon-map';

// Currency formatter
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export default function AnalyticsPage() { // Renamed from StatsPage
  const { transactions } = useTransactions();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  const categoryColors: { [key: string]: string } = {
    'Utilities': '#3b82f6',
    'Transport': '#22c55e',
    'Rent': '#f97316',
    'Grocery Store': '#ef4444',
  };

  // --- 2. UPDATED LOGIC to handle Week, Month, and Year ---
  const analysisData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const now = new Date();
    let chartData: { name: string; Total: number }[] = []; // Initialize with default value

    if (timeframe === 'week') {
      chartData = [
        { name: 'Mon', Total: 0 }, { name: 'Tue', Total: 0 }, { name: 'Wed', Total: 0 },
        { name: 'Thu', Total: 0 }, { name: 'Fri', Total: 0 }, { name: 'Sat', Total: 0 }, { name: 'Sun', Total: 0 }
      ];
      const today = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0..Sun=6
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - today));
      firstDayOfWeek.setHours(0, 0, 0, 0);

      expenses
        .filter(t => new Date(t.date) >= firstDayOfWeek)
        .forEach(t => {
          const day = new Date(t.date).getDay();
          const adjustedDay = day === 0 ? 6 : day - 1;
          chartData[adjustedDay].Total += t.amount;
        });
    }
    else if (timeframe === 'month') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      chartData = Array.from({ length: daysInMonth }, (_, i) => ({ name: `${i + 1}`, Total: 0 }));
      expenses
        .filter(t => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
        .forEach(t => {
          const dayOfMonth = new Date(t.date).getDate();
          chartData[dayOfMonth - 1].Total += t.amount;
        });
    }
    else if (timeframe === 'year') {
      chartData = [
        { name: 'Jan', Total: 0 }, { name: 'Feb', Total: 0 }, { name: 'Mar', Total: 0 },
        { name: 'Apr', Total: 0 }, { name: 'May', Total: 0 }, { name: 'Jun', Total: 0 },
        { name: 'Jul', Total: 0 }, { name: 'Aug', Total: 0 }, { name: 'Sep', Total: 0 },
        { name: 'Oct', Total: 0 }, { name: 'Nov', Total: 0 }, { name: 'Dec', Total: 0 }
      ];
      expenses
        .filter(t => new Date(t.date).getFullYear() === now.getFullYear())
        .forEach(t => {
          const month = new Date(t.date).getMonth();
          chartData[month].Total += t.amount;
        });
    }

    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }));

    return { topCategories, chartData };
  }, [transactions, timeframe]);

  return (
    <main className="max-w-md mx-auto p-4 pb-24">
      <header className="flex items-center mb-6">
        <Link href="/" className="p-2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto">Spending Analysis</h1>
      </header>
      
      {/* --- 1. NEW TOGGLE BUTTON STYLING --- */}
      <div className="flex w-full rounded-full bg-gray-100 p-1 mb-6">
        <button
          onClick={() => setTimeframe('week')}
          className={`flex-1 cursor-pointer rounded-full py-2 text-sm font-medium transition-colors ${
            timeframe === 'week' ? "bg-teal-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setTimeframe('month')}
          className={`flex-1 cursor-pointer rounded-full py-2 text-sm font-medium transition-colors ${
            timeframe === 'month' ? "bg-teal-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setTimeframe('year')}
          className={`flex-1 cursor-pointer rounded-full py-2 text-sm font-medium transition-colors ${
            timeframe === 'year' ? "bg-teal-500 text-white shadow" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          Year
        </button>
      </div>

      {/* --- 3. UPDATED BARCHART to use dynamic data --- */}
      <div className='h-70 mb-8'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analysisData.chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} tickCount={6} domain={[0, (dataMax: number) => Math.ceil(dataMax / 500) * 500]} />
            <Tooltip formatter={(value: number) => formatter.format(value)} />
            <Bar dataKey="Total" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Top Categories */}
      <div>
        <h2 className="text-lg font-bold mb-4">Top Categories</h2>
        <div className="space-y-3">
          {analysisData.topCategories.map(cat => {
            const Icon = getCategoryIcon(cat.name);
            return (
              <Card key={cat.name} className="p-4 border border-gray-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{cat.name}</p>
                      <p className="text-md text-gray-500 font-bold">
                        {formatter.format(cat.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <RadialProgress
                      value={cat.percentage}
                      color={categoryColors[cat.name] || '#6b7280'}
                    />
                    <p className="text-sm text-gray-500 font-bold mt-1">
                      {cat.percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}