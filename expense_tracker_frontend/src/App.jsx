import React, { useState, useEffect, useCallback } from 'react';
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
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Wallet, 
  PlusCircle, 
  Home, 
  Sliders, 
  RefreshCw, 
  FileCode, 
  LogOut 
} from 'lucide-react';

const LOCAL_STORAGE_KEY_TRANSACTIONS = 'expense_tracker_transactions_js_v1';
const LOCAL_STORAGE_KEY_BUDGET = 'expense_tracker_budget_js_v1';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'budget'
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#user-profile-menu')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenSignUp = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user, message, isNewUser = false) => {
    setCurrentUser(user);
    setCurrentView('app');

    const userStorageKey = `expense_tracker_transactions_${user.id}`;

    if (isNewUser) {
      setTransactions([]);
      localStorage.setItem(LOCAL_STORAGE_KEY_TRANSACTIONS, JSON.stringify([]));
      showToast('🎉 Welcome! Account dashboard is initialized at ₦0.00.', 'success');
    } else {
      try {
        const savedData = localStorage.getItem(userStorageKey);
        if (savedData !== null) {
          setTransactions(JSON.parse(savedData));
        } else if (isBackendConnected) {
          apiService.fetchTransactions().then((txs) => {
            if (Array.isArray(txs)) setTransactions(txs);
          });
        }
      } catch (e) {
        console.error('Error restoring user data', e);
      }
      showToast(message || 'Logged in successfully!', 'success');
    }
  };

  const handleLogout = async () => {
    showToast('Logging out...', 'info');
    try {
      await apiService.logout();
      setCurrentUser(null);
      setCurrentView('landing');
      showToast('Logged out successfully!', 'info');
    } catch (e) {
      console.warn('Logout error:', e);
      showToast('Network error during logout. Switched view.', 'info');
      setCurrentUser(null);
      setCurrentView('landing');
    }
  };

  const handleExploreDemo = () => {
    setCurrentView('app');
    showToast('Entered interactive demo mode!', 'info');
  };

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
        showToast('Synchronized with Backend!', 'success');
      } else {
        showToast('API offline. Operating in client mode.', 'info');
      }
    } catch (err) {
      console.warn('Backend connection failed:', err);
      setIsBackendConnected(false);
      showToast('Backend offline. Operating in client mode.', 'info');
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

  useEffect(() => {
    try {
      const storageKey = currentUser?.id
        ? `expense_tracker_transactions_${currentUser.id}`
        : LOCAL_STORAGE_KEY_TRANSACTIONS;
      localStorage.setItem(storageKey, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions:', e);
    }
  }, [transactions, currentUser]);

  useEffect(() => {
    try {
      const storageKey = currentUser?.id
        ? `expense_tracker_budget_${currentUser.id}`
        : LOCAL_STORAGE_KEY_BUDGET;
      localStorage.setItem(storageKey, JSON.stringify(budget));
    } catch (e) {
      console.error('Error saving budget:', e);
    }
  }, [budget, currentUser]);

  const handleSaveTransaction = async (data) => {
    if (data.id) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === data.id ? { ...data, id: data.id } : t))
      );
      if (isBackendConnected) {
        try {
          await apiService.updateTransaction(data.id, data);
          showToast('Updated in database!');
        } catch (err) {
          showToast('Updated locally (API error)', 'info');
        }
      } else {
        showToast('Transaction updated!');
      }
    } else {
      const tempId = 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const newTx = { ...data, id: tempId };
      setTransactions((prev) => [newTx, ...prev]);

      if (isBackendConnected) {
        try {
          const created = await apiService.createTransaction(data);
          setTransactions((prev) => prev.map((t) => (t.id === tempId ? created : t)));
          showToast('Saved to database!');
        } catch (err) {
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
          showToast('Deleted from database', 'info');
        } catch (err) {
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
        showToast('Budget saved!');
      } catch (err) {
        showToast('Budget updated locally', 'info');
      }
    } else {
      showToast('Budget updated');
    }
  };

  // Extract User Details
  const userInitial = currentUser?.name 
    ? currentUser.name.charAt(0).toUpperCase() 
    : (currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U');

  const fullName = currentUser?.name || currentUser?.full_name || 'Guest User';
  const username = currentUser?.username || 'guest_user';
  const email = currentUser?.email || 'guest@example.com';

  if (currentView === 'landing') {
    return (
      <>
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl">
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
          onGoToDashboard={() => setCurrentView('app')}
        />

        <AuthModal
          key={authModalMode}
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
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* LOOM-STYLE VERTICAL SIDEBAR NAVIGATION */}
      <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 justify-between select-none shrink-0 z-20">
        
        {/* Top Section */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Expense Tracker Brand Logo */}
          <button 
            title="Expense Tracker Home"
            onClick={() => setCurrentView('landing')}
            className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            <Wallet className="w-5 h-5" />
          </button>

          {/* User Profile Avatar with Click Menu */}
          <div id="user-profile-menu" className="relative flex items-center justify-center">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                isProfileOpen
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
              }`}
            >
              {userInitial}
            </button>

            {/* Click Popover Card: Full Name, Username, & Email */}
            {isProfileOpen && (
              <div className="absolute left-14 top-0 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl z-50 w-60 border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {userInitial}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm text-slate-100 truncate">{fullName}</p>
                    <p className="text-blue-400 text-xs font-medium truncate">@{username}</p>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Email Address
                    </span>
                    <span className="text-xs text-slate-200 truncate block mt-0.5">
                      {email}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Account Status
                    </span>
                    <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Active Session</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Transaction Action */}
          <button 
            title="Add Transaction"
            onClick={() => {
              setEditingTransaction(null);
              setIsFormModalOpen(true);
            }}
            className="w-10 h-10 text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center justify-center transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center gap-1 w-full px-2">
            <button 
              title="Budget Limits"
              onClick={() => setIsBudgetModalOpen(true)}
              className="w-10 h-10 text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-colors"
            >
              <Sliders className="w-5 h-5" />
            </button>

            {/* Refresh / Re-sync Backend */}
            <button 
              title="Refresh / Sync Backend"
              onClick={syncWithBackend}
              disabled={isSyncing}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors text-slate-600 hover:bg-slate-100 ${
                isSyncing ? 'animate-spin text-blue-600' : ''
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {/* Swagger API Docs */}
          <button 
            title="Swagger API Documentation"
            onClick={() => setIsSwaggerModalOpen(true)}
            className="w-10 h-10 text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-colors"
          >
            <FileCode className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-8 h-[1px] bg-slate-100 my-1" />

          {/* Logout Button */}
          <button 
            title="Logout"
            onClick={handleLogout}
            className="w-10 h-10 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-center transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👋</span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}!
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                🇳🇬 ₦ NGN Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track your daily expenses, monitor monthly category caps, and manage your budget seamlessly.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>

        {/* Overview Stats Cards */}
        <OverviewCards transactions={transactions} budget={budget} />

        {/* Budget Overview & Analytics Grid */}
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

        {/* Transaction History List */}
        <TransactionList
          transactions={transactions}
          budget={budget}
          onEditTransaction={(tx) => {
            setEditingTransaction(tx);
            setIsFormModalOpen(true);
          }}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsFormModalOpen(true);
          }}
        />
      </main>

      {/* MODALS */}
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
        key={authModalMode}
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
