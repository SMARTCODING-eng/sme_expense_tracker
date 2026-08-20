import React from 'react';
import {
  Wallet,
  ArrowRight,
  PieChart,
  FileCode,
  LogIn,
  UserPlus,
  LogOut,
  Play,
  Database,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export const LandingPage = ({
  onExploreDemo,
  onOpenSignUp,
  onOpenLogin,
  onOpenSwaggerDocs,
  currentUser,
  onLogout,
  onGoToDashboard
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">

      {/* =========================
          TOP NAVIGATION
      ========================== */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white rounded-xl shadow-md shadow-indigo-500/20">
              <Wallet className="w-6 h-6" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                Expense<span className="text-indigo-400">Tracker</span>
              </span>

              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                ₦ NGN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>

          {/* Authentication Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {currentUser ? (
              <>
                <button
                  onClick={onGoToDashboard}
                  title="Return to Dashboard"
                  className="px-3.5 py-1.5 bg-slate-8 hover:bg-slate-700 text-blue-400 font-semibold text-xs rounded border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer flex items-center space-x-1"
                
                >
                  <span>{currentUser.username || currentUser.name || 'user'}</span> 
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex items-center space-x-1 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold rounded-xl transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSignUp}
                  className="inline-flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up Free</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

        {/* Glowing Background Accent Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

          {/* Pill Banner */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs sm:text-sm font-medium text-slate-300 shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Effortless Personal & Business Budgeting</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Stop Guessing Where Your <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Money Goes Every Month
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Take complete control of your cash flow, track monthly budgets, and optimize category spending in real time with our secure web dashboard.
            </p>
          </div>

          {/* Focused CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            
            {/* Primary Action: Sign Up */}
            <button
              type="button"
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2.5 group hover:scale-[1.02] active:scale-95"
            >
              <UserPlus className="w-5 h-5 text-indigo-100" />
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          

            {/* Secondary Action: Explore Demo */}
            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm sm:text-base rounded-2xl border border-slate-800 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current text-slate-300" />
              <span>Explore Demo</span>
            </button>

          </div>

          {/* Micro Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 pt-2">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bank-Grade Encryption</span>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div>No Credit Card Required</div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div>Instant NGN Exports</div>
          </div>

          {/* =========================
              DASHBOARD PREVIEW MOCKUP
          ========================== */}
          <div id="preview" className="pt-8 max-w-5xl mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md text-left space-y-6">

              {/* Preview Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-500 pl-2">
                    app.expensetracker.ng/dashboard
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                    Live Dashboard Sync
                  </span>
                </div>
              </div>

              {/* Statistics Grid Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Income Card */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Monthly Income
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    ₦ 1,850,000.00
                  </div>
                  <span className="text-[11px] text-emerald-500/90 font-medium">
                    ↑ Salary & Revenue
                  </span>
                </div>

                {/* Expenses Card */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Total Expenses
                    </span>
                    <CreditCard className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-rose-400">
                    ₦ 645,200.00
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    18 Transactions logged
                  </span>
                </div>

                {/* Savings Balance Card */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Net Savings Balance
                    </span>
                    <PieChart className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-indigo-300">
                    ₦ 1,204,800.00
                  </div>
                  <span className="text-[11px] text-indigo-400 font-medium">
                    65.1% Savings Rate
                  </span>
                </div>
              </div>

              {/* Quick Callout Banner */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Want to test drive the interface?
                    </h4>
                    <p className="text-xs text-slate-400">
                      Try adding sample expenses, setting budget limits, and testing custom categories instantly.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onExploreDemo}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                >
                  Enter Live Dashboard &rarr;
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES SECTION
      ========================== */}
      <section id="features" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Speed, Security & Control
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Everything you need to streamline daily financial tracking and plan for long-term savings goals.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Feature 1 - NGN Currency */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg">
                ₦
              </div>
              <h3 className="font-bold text-base text-white">
                Nigerian Naira (₦ NGN)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native formatting and currency defaults built specifically for seamless financial logging across local accounts.
              </p>
            </div>

            {/* Feature 2 - Budget Caps */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">
                Category Budget Caps
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set custom monthly spending caps for food, utilities, business logistics, and leisure with real-time visual progress bars.
              </p>
            </div>

            {/* Feature 3 - Security */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">
                Private & Secure
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your personal financial data is protected with 256-bit encryption. Your financial history is never sold or shared.
              </p>
            </div>

            {/* Feature 4 - Reports & Export */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">
                Instant Exports & Analytics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate clean, structured financial summaries and CSV expense reports for personal review or business accounting.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">
              Expense Tracker NGN
            </span>
            <span>
              &mdash; Powered by Smartco.Ng Ltd
            </span>
          </div>

          {/* Footer Links (Developer docs live here) */}
          <div className="flex items-center space-x-5">
            <button
              type="button"
              onClick={onExploreDemo}
              className="hover:text-indigo-400 transition-colors"
            >
              Live Demo
            </button>

            <button
              type="button"
              onClick={onOpenSignUp}
              className="hover:text-white transition-colors"
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={onOpenLogin}
              className="hover:text-white transition-colors"
            >
              Log In
            </button>

            <button
              type="button"
              onClick={onOpenSwaggerDocs}
              className="inline-flex items-center space-x-1 text-slate-500 hover:text-emerald-400 transition-colors"
              title="View Swagger OpenAPI Documentation"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>API Docs</span>
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
};
