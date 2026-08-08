import React, { useState } from 'react';
import {
     X, 
     ExternalLink, 
     Code2, 
     Server, 
     FileCode, 
     CheckCircle2, 
     ShieldCheck, 
     Terminal
 } from 'lucide-react';

export const SwaggerDocsModal = ({ isOpen, onClose }) => {
  const [activeEndpointTab, setActiveEndpointTab] = useState('docs');

  if (!isOpen) return null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const docsUrl = `${API_BASE_URL}/docs/`;
  const redocUrl = `${API_BASE_URL}/redoc/`;
  const schemaUrl = `${API_BASE_URL}/schema/`;

  const endpointsList = [
    { method: 'POST', path: '/api/accounts/register/', desc: 'Register a new user account in Django DB and obtain auth token' },
    { method: 'POST', path: '/api/accounts/login/', desc: 'Authenticate user with email & password and retrieve Token' },
    { method: 'POST', path: '/api/accounts/logout/', desc: 'Invalidate current user session and destroy Auth Token' },
    { method: 'GET', path: '/api/accounts/me/', desc: 'Fetch current authenticated user profile details' },
    { method: 'GET / POST', path: '/api/categories/', desc: 'List or seed default categories (Food, Housing, Salary, etc.)' },
    { method: 'GET / POST', path: '/api/transactions/', desc: 'List, filter by type/category, search, or add transactions' },
    { method: 'PUT / DELETE', path: '/api/transactions/{id}/', desc: 'Retrieve, update, or remove transaction by UUID' },
    { method: 'GET / PUT', path: '/api/budget/', desc: 'Get or update total monthly budget caps and currency settings (₦ NGN)' },
    { method: 'GET', path: '/api/analytics/', desc: 'Calculated totals (Income, Expense, Net Balance & Category Spend)' },
    { method: 'GET', path: '/api/schema/', desc: 'OpenAPI 3.0 YAML / JSON OpenAPI Schema definition' },
    { method: 'GET', path: '/api/docs/', desc: 'Interactive Swagger UI endpoint tester' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative flex-none">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold tracking-tight">Swagger OpenAPI 3 Documentation</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Django REST Framework
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive API specification generated dynamically with <code className="text-emerald-300 bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">drf-spectacular</code>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Action Buttons for Swagger */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl group transition-all"
            >
              <div>
                <span className="block font-bold text-sm text-indigo-900">Swagger UI</span>
                <span className="text-xs text-indigo-600">Interactive Endpoint Tester</span>
              </div>
              <ExternalLink className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href={redocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl group transition-all"
            >
              <div>
                <span className="block font-bold text-sm text-slate-900">ReDoc Documentation</span>
                <span className="text-xs text-slate-500">Clean 3-Panel Schema Spec</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href={schemaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl group transition-all"
            >
              <div>
                <span className="block font-bold text-sm text-emerald-900">OpenAPI Schema</span>
                <span className="text-xs text-emerald-600">Raw JSON / YAML Output</span>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Quick Endpoints Directory */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <span>RESTful API Endpoints Specification</span>
              </h3>
              <span className="text-xs text-slate-600">Base URL: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-semibold">/api/</code></span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              {endpointsList.map((ep, idx) => (
                <div key={idx} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      ep.method.includes('POST') ? 'bg-emerald-100 text-emerald-800' :
                      ep.method.includes('PUT') ? 'bg-amber-100 text-amber-800' :
                      ep.method.includes('DELETE') ? 'bg-rose-100 text-rose-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono font-bold text-slate-900">{ep.path}</code>
                  </div>
                  <span className="text-xs text-slate-500 sm:text-right">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features highlight */}
          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Full OpenAPI 3.0 Compatibility</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The backend uses <code className="text-emerald-300 font-mono">drf-spectacular</code> for automatic OpenAPI 3.0 schema generation. You can test live payloads directly through Swagger UI or import the schema into Postman / Insomnia.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-none">
          <span className="text-xs text-slate-500 font-medium">Django REST Framework 3.14 + Swagger OpenAPI 3</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
