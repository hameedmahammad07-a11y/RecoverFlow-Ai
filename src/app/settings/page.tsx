'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, Key, ShieldCheck, Database, Radio } from 'lucide-react';

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('Apex Electronics & Store');
  const [email, setEmail] = useState('alex@apexstore.io');
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.merchant) {
          setStoreName(data.merchant.storeName || 'Apex Electronics & Store');
          setEmail(data.merchant.email || 'alex@apexstore.io');
          setMaxAttempts(data.merchant.maxRecoveryAttempts || 3);
          setQuietStart(data.merchant.quietHoursStart || '22:00');
          setQuietEnd(data.merchant.quietHoursEnd || '08:00');
        }
      });
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          maxRecoveryAttempts: maxAttempts,
          quietHoursStart: quietStart,
          quietHoursEnd: quietEnd,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-slate-400" />
            MERCHANT SETTINGS & SYSTEM STATUS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage merchant profile details, API credentials, and integration health
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Merchant Profile Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Merchant Profile Information
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Store / Business Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Account Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Max Recovery Attempts</label>
              <select
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={2}>2 Attempts Max</option>
                <option value={3}>3 Attempts Max</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Credentials & Webhook Secret */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            API & Gateway Webhook Secrets
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">RecoverFlow API Key</label>
              <input
                type="text"
                readOnly
                value="rf_live_sec_99382019482910481294"
                className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-slate-900 text-slate-300 border border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Webhook Secret Signature</label>
              <input
                type="text"
                readOnly
                value="whsec_029481928401928401294801"
                className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-slate-900 text-slate-300 border border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> Database Connection
              </span>
              <span className="text-emerald-400 font-bold">Prisma SQLite Connected</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-400" /> WebSockets / SSE Event Hub
              </span>
              <span className="text-blue-400 font-bold">Active & Listening</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
