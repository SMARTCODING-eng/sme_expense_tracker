import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewCards } from './components/OverviewCards';
import { BudgetOverview } from './components/BudgetOverview';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionList } from './components/TransactionList';
import { TransactionFormModal } from './components/TransactionFormModal';
import { BudgetModal } from './components/BudgetModal';
import { ExportImportModal } from './components/ExportImportModal';
import { SAMPLE_TRANSACTIONS, INITIAL_BUDGET } from './data/sampleData';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const LOCAL_STORAGE_KEY_TRANSACTIONS = 'expense_tracker_transactions_js_v1';
const LOCAL_STORAGE_KEY_BUDGET = 'expense_tracker_budget_js_v1';

export default function App() {
  // Load transactions state
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading transactions from localStorage:', e);
    }
    return SAMPLE_TRANSACTIONS;
  });

  // Load budget config state
  const [budget, setBudget] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BUDGET);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading budget config from localStorage:', e);
    }
    return INITIAL_BUDGET;
  });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage:', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BUDGET, JSON.stringify(budget));
    } catch (e) {
      console.error('Error saving budget to localStorage:', e);
    }
  }, [budget]);

  // Transaction Actions
  const handleSaveTransaction = (data) => {
    if (data.id) {
      // Edit
      setTransactions((prev) =>
        prev.map((t) => (t.id === data.id ? { ...data, id: data.id } : t))
      );
      showToast('Transaction updated successfully!');
    } else {
      // Add
      const newTransaction = {
        ...data,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      showToast('New transaction added!');
    }
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast('Transaction removed', 'info');
    }
  };

  const handleUpdateBudget = (newBudget) => {
    setBudget((prev) => ({ ...prev, ...newBudget }));
    showToast('Budget settings updated');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all transactions and budget settings to sample data?')) {
      setTransactions(SAMPLE_TRANSACTIONS);
      setBudget(INITIAL_BUDGET);
      showToast('Reset to initial sample data', 'info');
    }
  };

  const handleImportData = (imported) => {
    setTransactions(imported);
    showToast(`Restored ${imported.length} transactions from backup`);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-12">
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        budget={budget}
        onUpdateBudget={handleUpdateBudget}
        onOpenAddModal={handleOpenAdd}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Overview Stats Cards */}
        <OverviewCards transactions={transactions} budget={budget} />

        {/* Middle Section: Budget Tracker & Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <BudgetOverview
              transactions={transactions}
              budget={budget}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />
          </div>
          <div className="lg:col-span-6">
            <AnalyticsCharts transactions={transactions} budget={budget} />
          </div>
        </div>

        {/* Main Transactions List */}
        <TransactionList
          transactions={transactions}
          budget={budget}
          onEditTransaction={handleOpenEdit}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenAddModal={handleOpenAdd}
        />
      </main>

      {/* Modals */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveTransaction}
        initialTransaction={editingTransaction}
        budget={budget}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budget={budget}
        onSaveBudget={(newBudget) => {
          setBudget(newBudget);
          showToast('Budget limits saved');
        }}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={transactions}
        budget={budget}
        onImportData={handleImportData}
      />
    </div>
  );
}
