import React from 'react';
import { PlusCircle, RotateCcw, WalletCards, Settings, Server, RefreshCw, Home, FileCode, LogOut } from 'lucide-react';

export const Header = ({
  budget,
  onOpenAddModal,
  onOpenBudgetModal,
  onResetData,
  isBackendConnected,
  onSyncBackend,
  isSyncing,
  onGoToLanding,
  onOpenSwaggerDocs,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToLanding}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs flex items-center justify-center transition-colors"
              title="Return to Landing Page"
            >
              <WalletCards className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  onClick={onGoToLanding}
                  className="text-xl font-bold text-slate-900 tracking-tight hover:text-indigo-600 transition-colors text-left"
                >
                  Expense Tracker
                </button>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Pro
                </span>
                
                {/* Django DRF & PostgreSQL Backend Status Badge */}
                <button
                  onClick={onSyncBackend}
                  disabled={isSyncing}
                  title={isBackendConnected ? "Connected to Django REST Framework (PostgreSQL). Click to re-sync." : "Django Backend server offline. Using local persistence fallback. Click to retry connection."}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${
                    isBackendConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Server className="w-3 h-3" />
                  <span>{isBackendConnected ? 'Django DRF API (PostgreSQL)' : 'Offline Local Fallback'}</span>
                  <RefreshCw className={`w-3 h-3 shrink-0 ${isSyncing ? 'animate-spin text-indigo-600' : 'opacity-70'}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Full-stack financial management with Django REST API & PostgreSQL persistence
                {currentUser && <span className="text-indigo-600 font-semibold ml-2">&bull; Hello, {currentUser.name}</span>}
              </p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Landing Page Home Button */}
            <button
              onClick={onGoToLanding}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
              title="Return to Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Landing Page</span>
            </button>

            {/* Swagger API Button */}
            <button
              onClick={onOpenSwaggerDocs}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-semibold rounded-lg transition-colors"
              title="Open Swagger OpenAPI Documentation"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Swagger API</span>
            </button>

            {/* Currency Badge - Fixed to Nigerian Naira */}
            <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 font-extrabold text-sm">₦</span>
              <span>NGN (Naira)</span>
            </div>

            {/* Logout Button if Logged In */}
            {currentUser && (
              <button
                onClick={onLogout}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors border border-rose-200"
                title="Logout from Django Accounts session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Logout</span>
              </button>
            )}

            {/* Budget Settings Button */}
            <button
              onClick={onOpenBudgetModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Budget Limits</span>
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
