// API service layer for connecting React frontend to Django REST Framework backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// console.log(import.meta.env.VITE_API_BASE_URL);
// console.log(import.meta.env);
/**
 * Format JS transaction object into Django REST Framework expected payload
 */
function toServerTransaction(tx) {
  return {
    id: tx.id,
    title: tx.title,
    amount: parseFloat(tx.amount) || 0,
    type: tx.type,
    category_id: typeof tx.category === 'object' ? tx.category?.id : tx.category,
    date: tx.date,
    payment_method: tx.paymentMethod || tx.payment_method || 'card',
    notes: tx.notes || '',
    is_recurring: Boolean(tx.isRecurring || tx.is_recurring),
  };
}


function toClientTransaction(tx) {
  return {
    id: tx.id,
    title: tx.title,
    amount: parseFloat(tx.amount),
    type: tx.type,
    category: tx.category_detail ? tx.category_detail.id : (tx.category_id || tx.category || 'other_expense'),
    categoryDetail: tx.category_detail || null,
    date: tx.date,
    paymentMethod: tx.payment_method || 'card',
    notes: tx.notes || '',
    isRecurring: Boolean(tx.is_recurring),
  };
}

/**
 * Format Django server budget response into JS camelCase object
 */
function toClientBudget(b) {
  return {
    monthlyTotalBudget: parseFloat(b.monthly_total_budget) || 3500,
    currencySymbol: b.currency_symbol || '₦',
    currencyCode: b.currency_code || 'NGN',
    categoryBudgets: b.category_budgets || {},
  };
}

/**
 * Format JS budget object into Django expected payload
 */
function toServerBudget(b) {
  return {
    monthly_total_budget: parseFloat(b.monthlyTotalBudget) || 3500,
    currency_symbol: b.currencySymbol || '₦',
    currency_code: b.currencyCode || 'NGN',
    category_budgets: b.categoryBudgets || {},
  };
}

export const apiService = {
  /**
   * Check connection status to Django backend
   */
  async register(email, password, fullname) {
    const res = await fetch(`${API_BASE_URL}/auth/register/`,{
      method: 'POST',
      headers: { 'Conten-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.email ? err.email[0] : (err.detail || 'Registration failed.');
      throw new Error(msg);
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('django_auth_token', data.token);
    }
    return data;
  },


  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.detail || (err.email ? err.email[0] : 'Invalid login credentials.');
      throw new Error(msg);
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('django_auth_token', data.token);
    }
    return data;
  },


  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/`, { method: 'GET' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  /**
   * Fetch categories from Django API
   */
  async fetchCategories() {
    const res = await fetch(`${API_BASE_URL}/categories/`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  },

  /**
   * Fetch transactions list with optional filter parameters
   */
  async fetchTransactions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sort_by', filters.sortBy);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/transactions/${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const data = await res.json();
    return data.map(toClientTransaction);
  },

  /**
   * Create a new transaction in Django DB
   */
  async createTransaction(transactionData) {
    const payload = toServerTransaction(transactionData);
    const res = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create transaction');
    }
    const data = await res.json();
    return toClientTransaction(data);
  },

  /**
   * Update existing transaction in Django DB
   */
  async updateTransaction(id, transactionData) {
    const payload = toServerTransaction(transactionData);
    const res = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update transaction');
    }
    const data = await res.json();
    return toClientTransaction(data);
  },

  /**
   * Delete transaction from Django DB
   */
  async deleteTransaction(id) {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
    return true;
  },

  /**
   * Fetch budget configuration from Django API
   */
  async fetchBudget() {
    const res = await fetch(`${API_BASE_URL}/budget/`);
    if (!res.ok) throw new Error('Failed to fetch budget configuration');
    const data = await res.json();
    return toClientBudget(data);
  },

  /**
   * Update budget configuration in Django API
   */
  async updateBudget(budgetData) {
    const payload = toServerBudget(budgetData);
    const res = await fetch(`${API_BASE_URL}/budget/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update budget configuration');
    const data = await res.json();
    return toClientBudget(data);
  },

  /**
   * Fetch analytics summary directly calculated by Django DB
   */
  async fetchAnalytics() {
    const res = await fetch(`${API_BASE_URL}/analytics/`);
    if (!res.ok) throw new Error('Failed to fetch analytics summary');
    return await res.json();
  }
};
