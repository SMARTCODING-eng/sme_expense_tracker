import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { OverviewCards } from './components/OverviewCards';
import { BudgetOverview } from './components/BudgetOverview';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionList } from './components/TransactionList';
import { TransactionFormModal } from './components/TransactionFormModal';
import { BudgetModal } from './components/BudgetModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { SwaggerDocsModal } from './components/SwaggerDocsModal';
import { SAMPLE_TRANSACTIONS, INITIAL_BUDGET } from './data/sampleData';
import { apiService } from './services/api';
import { CheckCircle, AlertCircle, Info, Database, PlusCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY_TRANSACTIONS = 'expense_tracker_transactions_js_v1';
const LOCAL_STORAGE_KEY_BUDGET = 'expense_tracker_budget_js_v1';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'app'
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Auth & Docs modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'
  const [isSwaggerModalOpen, setIsSwaggerModalOpen] = useState(false);

  // Load initial transactions state
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

  // Load initial budget config state
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

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenSignUp = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    setCurrentView('app');
    showToast(message, 'success');
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setCurrentUser(null);
    showToast('Logged out successfully from Django Accounts session.', 'info');
  };

  const handleExploreDemo = () => {
    setCurrentView('app');
    showToast('Entered interactive demo mode!', 'info');
  };

  // Sync state with Django REST API Backend
  const syncWithBackend = useCallback(async () => {
    setIsSyncing(true);
    try {
      const isAlive = await apiService.checkHealth();
      setIsBackendConnected(isAlive);

      if (isAlive) {
        const [fetchedTx, fetchedBudget] = await Promise.all([
          apiService.fetchTransactions(),
          apiService.fetchBudget().catch(() => null),
        ]);

        if (fetchedTx && Array.isArray(fetchedTx) && fetchedTx.length > 0) {
          setTransactions(fetchedTx);
        }
        if (fetchedBudget) {
          setBudget((prev) => ({ ...prev, ...fetchedBudget }));
        }
        showToast('Synchronized with Django REST Framework (PostgreSQL)!', 'success');
      } else {
        showToast('Django API offline. Operating in client fallback mode.', 'info');
      }
    } catch (err) {
      console.warn('Backend connection failed:', err);
      setIsBackendConnected(false);
      showToast('Backend offline. Operating in client fallback mode.', 'info');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
    apiService.getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    }).catch(() => {});
  }, [syncWithBackend]);

  // Sync local changes to localStorage for offline persistence
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

  // Transaction Actions (with Django API integration)
  const handleSaveTransaction = async (data) => {
    if (data.id) {
      // Edit existing transaction
      setTransactions((prev) =>
        prev.map((t) => (t.id === data.id ? { ...data, id: data.id } : t))
      );

      if (isBackendConnected) {
        try {
          await apiService.updateTransaction(data.id, data);
          showToast('Updated in PostgreSQL database!');
        } catch (err) {
          console.error('API update failed:', err);
          showToast('Updated locally (API error)', 'info');
        }
      } else {
        showToast('Transaction updated successfully!');
      }
    } else {
      // Add new transaction
      const tempId = 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const newTx = { ...data, id: tempId };

      setTransactions((prev) => [newTx, ...prev]);

      if (isBackendConnected) {
        try {
          const created = await apiService.createTransaction(data);
          // Replace temp item with server response
          setTransactions((prev) => prev.map((t) => (t.id === tempId ? created : t)));
          showToast('Saved to PostgreSQL database!');
        } catch (err) {
          console.error('API create failed:', err);
          showToast('Saved locally (API error)', 'info');
        }
      } else {
        showToast('New transaction added!');
      }
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      if (isBackendConnected) {
        try {
          await apiService.deleteTransaction(id);
          showToast('Deleted from PostgreSQL database', 'info');
        } catch (err) {
          console.error('API delete failed:', err);
          showToast('Removed locally', 'info');
        }
      } else {
        showToast('Transaction removed', 'info');
      }
    }
  };

  const handleUpdateBudget = async (newBudget) => {
    const updated = { ...budget, ...newBudget };
    setBudget(updated);

    if (isBackendConnected) {
      try {
        await apiService.updateBudget(updated);
        showToast('Budget saved to PostgreSQL database!');
      } catch (err) {
        console.error('API budget update failed:', err);
        showToast('Budget updated locally', 'info');
      }
    } else {
      showToast('Budget settings updated');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all transactions and budget settings to sample data?')) {
      setTransactions(SAMPLE_TRANSACTIONS);
      setBudget(INITIAL_BUDGET);
      showToast('Reset to initial sample data', 'info');
    }
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsFormModalOpen(true);
  };

  if (currentView === 'landing') {
    return (
      <>
        {/* Toast Banner */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 duration-200">
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        )}

        <LandingPage
          onExploreDemo={handleExploreDemo}
          onOpenSignUp={handleOpenSignUp}
          onOpenLogin={handleOpenLogin}
          onOpenSwaggerDocs={() => setIsSwaggerModalOpen(true)}
          isBackendConnected={isBackendConnected}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onAuthSuccess={handleAuthSuccess}
        />

        <SwaggerDocsModal
          isOpen={isSwaggerModalOpen}
          onClose={() => setIsSwaggerModalOpen(false)}
        />
      </>
    );
  }

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
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onResetData={handleResetData}
        isBackendConnected={isBackendConnected}
        onSyncBackend={syncWithBackend}
        isSyncing={isSyncing}
        onGoToLanding={() => setCurrentView('landing')}
        onOpenSwaggerDocs={() => setIsSwaggerModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Warm Welcome Banner Header Card */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1 z-10">
            <div className="flex items-center space-x-2">
              <span className="text-2xl animate-bounce">👋</span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Warm Welcome{currentUser?.name ? `, ${currentUser.name}` : ''}!
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                🇳🇬 ₦ NGN Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track your daily expenses, monitor monthly category caps, and keep your finances healthy. Your data is synced with Django REST Framework and PostgreSQL.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 z-10 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Transaction</span>
            </button>
          </div>
        </div>

        {/* Backend Connectivity Info Card */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">Django REST Framework + PostgreSQL Engine</span>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold border border-emerald-500/30">
                  Swagger OpenAPI 3 Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Full CRUD endpoints (`/api/transactions/`, `/api/budget/`, `/api/analytics/`, `/api/docs/`) connected to frontend state.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSwaggerModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/40 transition-colors"
            >
              Open Swagger Docs
            </button>
            <button
              onClick={syncWithBackend}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl border border-white/20 transition-colors shrink-0"
            >
              {isSyncing ? 'Syncing...' : 'Re-verify API Status'}
            </button>
          </div>
        </div>

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
          handleUpdateBudget(newBudget);
          showToast('Budget limits saved');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <SwaggerDocsModal
        isOpen={isSwaggerModalOpen}
        onClose={() => setIsSwaggerModalOpen(false)}
      />
    </div>
  );
}
