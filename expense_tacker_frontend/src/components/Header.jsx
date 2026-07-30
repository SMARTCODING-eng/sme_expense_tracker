import React from 'react';
import { PlusCircle, Download, RotateCcw, WalletCards, Settings } from 'lucide-react';

export const Header = ({
  budget,
  onUpdateBudget,
  onOpenAddModal,
  onOpenExportModal,
  onOpenBudgetModal,
  onResetData,
}) => {
  const currencies = [
    { symbol: '₦', code: 'NGN' },
    
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs flex items-center justify-center">
              <WalletCards className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Tracker</h1>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Smart personal finance & budget management</p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => onUpdateBudget({ currencySymbol: c.symbol, currencyCode: c.code })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    budget.currencySymbol === c.symbol
                      ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`${c.code} (${c.symbol})`}
                >
                  {c.symbol}
                </button>
              ))}
            </div>

            {/* Budget Settings Button */}
            <button
              onClick={onOpenBudgetModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Budget Limits</span>
            </button>

            {/* Export / Data Button */}
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export/Import</span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title="Reset to Sample Data"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Add Transaction Main Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
