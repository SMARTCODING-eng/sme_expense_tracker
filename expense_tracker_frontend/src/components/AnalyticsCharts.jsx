import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Info } from 'lucide-react';
import { getCategoryById } from '../data/categories';
import { formatCurrency } from '../utils/formatters';

export const AnalyticsCharts = ({ transactions, budget }) => {
  const [activeTab, setActiveTab] = useState('category');

  // Category Breakdown Data (Expenses)
  const categoryTotals = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });

  const pieData = Object.entries(categoryTotals)
    .map(([catId, amount]) => {
      const cat = getCategoryById(catId);
      return {
        id: catId,
        name: cat.name,
        value: Math.round(amount * 100) / 100,
        color: cat.color,
      };
    })
    .sort((a, b) => b.value - a.value);

  const totalExpenseAmount = pieData.reduce((acc, curr) => acc + curr.value, 0);

  // Timeline Bar Chart Data (Grouped by Date)
  const dateMap = {};
  
  transactions.forEach((t) => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      dateMap[t.date].income += Number(t.amount);
    } else {
      dateMap[t.date].expense += Number(t.amount);
    }
  });

  const timelineData = Object.entries(dateMap)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-10)
    .map(([date, values]) => {
      const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return {
        date: formatted,
        rawDate: date,
        Income: Math.round(values.income),
        Expense: Math.round(values.expense),
      };
    });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-indigo-600" />
            <span>Visual Analytics</span>
          </h2>
          <p className="text-xs text-slate-500">Analyze spending patterns and income flow</p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('category')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'category'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>By Category</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cash Flow Trend</span>
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="mt-5">
        {activeTab === 'category' ? (
          <div>
            {pieData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                <Info className="w-8 h-8 mb-2 stroke-1" />
                <span>No expense data recorded yet to render breakdown.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Donut Chart */}
                <div className="lg:col-span-6 h-64 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.id} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [
                          formatCurrency(val, budget.currencySymbol),
                          'Amount',
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Donut Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-3xs uppercase tracking-wider text-slate-400 font-bold">Total Spent</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatCurrency(totalExpenseAmount, budget.currencySymbol)}
                    </span>
                  </div>
                </div>

                {/* Legend & Breakdown List */}
                <div className="lg:col-span-6 space-y-2 max-h-64 overflow-y-auto pr-1">
                  {pieData.map((item) => {
                    const pct = totalExpenseAmount > 0 ? Math.round((item.value / totalExpenseAmount) * 100) : 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <span className="text-slate-400 text-xs font-medium">{pct}%</span>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(item.value, budget.currencySymbol)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {timelineData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                <Info className="w-8 h-8 mb-2 stroke-1" />
                <span>No daily transactions to show timeline.</span>
              </div>
            ) : (
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value, budget.currencySymbol),
                        '',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
