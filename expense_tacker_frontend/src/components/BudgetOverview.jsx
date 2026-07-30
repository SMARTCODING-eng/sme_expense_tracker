import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, Sliders } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../data/categories';
import { CategoryIcon } from '../utils/iconMap';

export const BudgetOverview = ({
  transactions,
  budget,
  onOpenBudgetModal,
}) => {
  // Compute total expenses
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetLimit = budget.monthlyTotalBudget;
  const percentage = budgetLimit > 0 ? Math.min(100, Math.round((totalExpense / budgetLimit) * 100)) : 0;
  const remaining = budgetLimit - totalExpense;

  // Compute category spending
  const categorySpendingMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categorySpendingMap[t.category] = (categorySpendingMap[t.category] || 0) + Number(t.amount);
    });

  // Pick top budgeted categories
  const categoriesWithBudget = CATEGORIES.filter(
    (c) => c.type === 'expense' && (budget.categoryBudgets[c.id] || 0) > 0
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Monthly Budget Tracker</span>
          </h2>
          <p className="text-xs text-slate-500">
            Monthly target: {formatCurrency(budgetLimit, budget.currencySymbol)}
          </p>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100/50 self-start sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Adjust Limits</span>
        </button>
      </div>

      {/* Main Total Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span className="flex items-center space-x-1.5">
            <span>Overall Spending:</span>
            <span className="text-slate-900 font-bold">
              {formatCurrency(totalExpense, budget.currencySymbol)}
            </span>
          </span>
          <span className="text-slate-500">
            {percentage}% of limit
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 100
                ? 'bg-rose-500'
                : percentage >= 80
                ? 'bg-amber-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        {/* Status Message */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          {remaining < 0 ? (
            <div className="flex items-center space-x-1.5 text-rose-600 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Over budget by {formatCurrency(Math.abs(remaining), budget.currencySymbol)}!</span>
            </div>
          ) : percentage >= 80 ? (
            <div className="flex items-center space-x-1.5 text-amber-600 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Nearing limit ({formatCurrency(remaining, budget.currencySymbol)} left)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>On track ({formatCurrency(remaining, budget.currencySymbol)} remaining)</span>
            </div>
          )}

          <span className="text-slate-400 hidden sm:inline">
            Total Cap: {formatCurrency(budgetLimit, budget.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Category Budgets Grid */}
      {categoriesWithBudget.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Category Budget Limits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoriesWithBudget.slice(0, 6).map((cat) => {
              const spent = categorySpendingMap[cat.id] || 0;
              const cap = budget.categoryBudgets[cat.id] || 0;
              const catPercent = cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
              const isOver = spent > cap;

              return (
                <div key={cat.id} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div
                        className="p-1 rounded-md"
                        style={{ backgroundColor: cat.bgColor, color: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {formatCurrency(spent, budget.currencySymbol)} / {formatCurrency(cap, budget.currencySymbol)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? 'bg-rose-500' : catPercent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, catPercent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
