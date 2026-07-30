import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CategoryIcon } from '../utils/iconMap';

export const BudgetModal = ({
  isOpen,
  onClose,
  budget,
  onSaveBudget,
}) => {
  const [totalBudget, setTotalBudget] = useState(budget.monthlyTotalBudget);
  const [categoryBudgets, setCategoryBudgets] = useState({
    ...budget.categoryBudgets,
  });

  if (!isOpen) return null;

  const handleCategoryChange = (catId, value) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [catId]: Math.max(0, value),
    }));
  };

  const handleSave = () => {
    onSaveBudget({
      ...budget,
      monthlyTotalBudget: Math.max(0, totalBudget),
      categoryBudgets,
    });
    onClose();
  };

  const expenseCategories = CATEGORIES.filter((c) => c.type === 'expense');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Configure Monthly Budget Limits</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Overall Target */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <label className="block font-bold text-slate-800 mb-1">
              Overall Monthly Budget Cap ({budget.currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                {budget.currencySymbol}
              </span>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <p className="text-xs text-indigo-700/80 mt-1 font-medium">
              Used to calculate overall spending alerts and percentage indicators.
            </p>
          </div>

          {/* Category Caps */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Category Monthly Caps</h4>
            <div className="space-y-2.5">
              {expenseCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className="p-1.5 rounded-lg shrink-0"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
                  </div>

                  <div className="relative w-32 shrink-0">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                      {budget.currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={categoryBudgets[cat.id] || 0}
                      onChange={(e) => handleCategoryChange(cat.id, parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-1"
          >
            <Check className="w-4 h-4" />
            <span>Apply Budget</span>
          </button>
        </div>
      </div>
    </div>
  );
};
