import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  Receipt,
  X,
  Plus,
  Repeat,
} from 'lucide-react';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { CategoryIcon, getPaymentIcon, getPaymentLabel } from '../utils/iconMap';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TransactionList = ({
  transactions,
  budget,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  const [filter, setFilter] = useState({
    search: '',
    type: 'all',
    category: 'all',
    paymentMethod: 'all',
    dateRange: 'all',
    sortBy: 'date_desc',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search term
        if (filter.search.trim()) {
          const q = filter.search.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchCategory = getCategoryById(t.category).name.toLowerCase().includes(q);
          const matchNotes = t.notes?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchCategory && !matchNotes) return false;
        }

        // Type filter
        if (filter.type !== 'all' && t.type !== filter.type) return false;

        // Category filter
        if (filter.category !== 'all' && t.category !== filter.category) return false;

        // Payment method filter
        if (filter.paymentMethod !== 'all' && t.paymentMethod !== filter.paymentMethod) return false;

        // Date range filter
        if (filter.dateRange !== 'all') {
          const tDate = new Date(t.date + 'T00:00:00');
          const now = new Date();
          if (filter.dateRange === 'this_month') {
            if (tDate.getMonth() !== now.getMonth() || tDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
          } else if (filter.dateRange === 'last_month') {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            if (
              tDate.getMonth() !== lastMonth.getMonth() ||
              tDate.getFullYear() !== lastMonth.getFullYear()
            ) {
              return false;
            }
          } else if (filter.dateRange === 'this_year') {
            if (tDate.getFullYear() !== now.getFullYear()) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'date_desc') return b.date.localeCompare(a.date);
        if (filter.sortBy === 'date_asc') return a.date.localeCompare(b.date);
        if (filter.sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
        if (filter.sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [transactions, filter]);

  const activeFilterCount =
    (filter.type !== 'all' ? 1 : 0) +
    (filter.category !== 'all' ? 1 : 0) +
    (filter.paymentMethod !== 'all' ? 1 : 0) +
    (filter.dateRange !== 'all' ? 1 : 0) +
    (filter.search ? 1 : 0);

  const clearFilters = () => {
    setFilter({
      search: '',
      type: 'all',
      category: 'all',
      paymentMethod: 'all',
      dateRange: 'all',
      sortBy: 'date_desc',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <span>Transaction History</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold border border-slate-200">
                {filteredTransactions.length} items
              </span>
            </h2>
            <p className="text-xs text-slate-500">View, search, and manage your financial records</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                activeFilterCount > 0 || showFilters
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 bg-indigo-600 text-white text-3xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick Type Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setFilter({ ...filter, type: 'all' })}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  filter.type === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter({ ...filter, type: 'expense' })}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  filter.type === 'expense'
                    ? 'bg-white text-rose-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setFilter({ ...filter, type: 'income' })}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  filter.type === 'income'
                    ? 'bg-white text-emerald-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Income
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            placeholder="Search by title, category, or notes..."
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {filter.search && (
            <button
              onClick={() => setFilter({ ...filter, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expandable Filters Panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Category Dropdown */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Dropdown */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date Range</label>
              <select
                value={filter.dateRange}
                onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={filter.paymentMethod}
                onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Methods</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="transfer">Bank Transfer</option>
                <option value="digital_wallet">Digital Wallet</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sort By</label>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="date_desc">Date (Newest First)</option>
                <option value="date_asc">Date (Oldest First)</option>
                <option value="amount_desc">Amount (High to Low)</option>
                <option value="amount_asc">Amount (Low to High)</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-1">
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 font-semibold hover:underline flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3 stroke-1" />
            <h3 className="text-sm font-semibold text-slate-800">No transactions found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search filters or add a new transaction to start tracking.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Transaction</span>
            </button>
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const cat = getCategoryById(t.category);
            const isIncome = t.type === 'income';

            return (
              <div
                key={t.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left Info */}
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div
                    className="p-2.5 rounded-xl shrink-0 mt-0.5"
                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{t.title}</h4>
                      {t.isRecurring && (
                        <span className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-600 text-3xs font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>Recurring</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1 flex-wrap gap-y-1">
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                      <span>•</span>
                      <span>{formatDate(t.date)}</span>
                      <span>•</span>
                      <span className="inline-flex items-center space-x-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {getPaymentIcon(t.paymentMethod)}
                        <span>{getPaymentLabel(t.paymentMethod)}</span>
                      </span>
                    </div>

                    {t.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic line-clamp-1 bg-slate-50/80 px-2 py-0.5 rounded border border-slate-100 inline-block max-w-md">
                        "{t.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span
                      className={`text-base font-extrabold tracking-tight ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(Number(t.amount), budget.currencySymbol)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTransaction(t)}
                      title="Edit Transaction"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      title="Delete Transaction"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
