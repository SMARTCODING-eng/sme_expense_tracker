import React from 'react';
import { ArrowUpRight, ArrowDownRight, Scale, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const OverviewCards = ({ transactions, budget }) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Balance</span>
          <div className={`p-2 rounded-xl ${netBalance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className={`text-2xl font-extrabold tracking-tight ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {formatCurrency(netBalance, budget.currencySymbol)}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {netBalance >= 0 ? 'Positive cash flow' : 'Expenses exceed income'}
          </p>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Income</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(totalIncome, budget.currencySymbol)}
          </h3>
          <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center space-x-1">
            <span>+{transactions.filter((t) => t.type === 'income').length} income records</span>
          </p>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</span>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(totalExpense, budget.currencySymbol)}
          </h3>
          <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center space-x-1">
            <span>{transactions.filter((t) => t.type === 'expense').length} expense entries</span>
          </p>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Savings Rate</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{savingsRate}%</h3>
            <span className="text-xs font-medium text-slate-400">
              Target: 20%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                savingsRate >= 20 ? 'bg-indigo-600' : savingsRate > 0 ? 'bg-amber-500' : 'bg-slate-300'
              }`}
              style={{ width: `${Math.min(100, savingsRate)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
