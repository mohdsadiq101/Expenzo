// src/app/analytics/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';

// Currency formatter
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function StatsPage() {
  const { transactions } = useTransactions();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  const analysisData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');

    // Top Categories calculation
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

    // Chart Data (simplified for this example - weekly view)
    const weeklyExpenses = [
        { day: 'Mon', total: 0 }, { day: 'Tue', total: 0 }, { day: 'Wed', total: 0 },
        { day: 'Thu', total: 0 }, { day: 'Fri', total: 0 }, { day: 'Sat', total: 0 }, { day: 'Sun', total: 0 }
    ];
    expenses.forEach(t => {
        const day = new Date(t.date).getDay(); // Sunday = 0, Monday = 1
        // Adjust so Monday is 0
        const adjustedDay = day === 0 ? 6 : day -1;
        weeklyExpenses[adjustedDay].total += t.amount;
    })

    return { topCategories, weeklyExpenses };
  }, [transactions, timeframe]);

  return (
    <main className="max-w-md mx-auto p-4 pb-24">
      <header className="flex items-center mb-6">
        <Link href="/" className="p-2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold mx-auto">Spending Analysis</h1>
      </header>

      <ToggleGroup
        type="single"
        value={timeframe}
        onValueChange={(value: 'week' | 'month' | 'year') => {
          if (value) setTimeframe(value);
        }}
        className="grid grid-cols-3 mb-6"
      >
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>

      {/* Chart */}
      <div className='h-60 mb-8'>
         <ResponsiveContainer width="100%" height="100%">
             <BarChart data={analysisData.weeklyExpenses}>
                 <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                 <Tooltip />
                 <Bar dataKey="total" fill="#34d399" radius={[4, 4, 0, 0]} />
             </BarChart>
         </ResponsiveContainer>
      </div>

      {/* Top Categories */}
      <div>
        <h2 className="text-lg font-bold mb-4">Top Categories</h2>
        <div className="space-y-3">
          {analysisData.topCategories.map(cat => (
            <Card key={cat.name} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-sm text-gray-500">{cat.percentage.toFixed(0)}% of total</p>
                </div>
                <p className="font-bold">{formatter.format(cat.amount)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}