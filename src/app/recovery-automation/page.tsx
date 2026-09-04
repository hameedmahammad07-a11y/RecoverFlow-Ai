'use client';

import React, { useEffect, useState } from 'react';
import { Bot, ShieldCheck, Clock, MessageSquare, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

export default function RecoveryAutomationPage() {
  const [maxAttempts, setMaxAttempts] = useState('3');
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [autoRecoveryEnabled, setAutoRecoveryEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.merchant) {
          setMaxAttempts(String(data.merchant.maxRecoveryAttempts || 3));
          setQuietHoursStart(data.merchant.quietHoursStart || '22:00');
          setQuietHoursEnd(data.merchant.quietHoursEnd || '08:00');
          setAutoRecoveryEnabled(data.merchant.autoRecoveryEnabled ?? true);
        }
      });
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxRecoveryAttempts: maxAttempts,
          quietHoursStart,
          quietHoursEnd,
          autoRecoveryEnabled,
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
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-blue-500" />
            Recovery Automation Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure automated attempt limits, quiet hours policy, and anti-spam guardrails
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved Successfully!' : 'Save Rules'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules Config Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Automation Rules & Policy Settings
          </h2>

          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Auto-Recovery Engine</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Automatically process verified failed payments
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoRecoveryEnabled}
              onChange={(e) => setAutoRecoveryEnabled(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* Max Attempts Selector (2 vs 3) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white block">
              Maximum Recovery Attempts Limit
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Strict limit enforced to prevent customer messaging fatigue (Merchant Rule)
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {['2', '3'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxAttempts(num)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    maxAttempts === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {num} Attempts Max
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Hours Settings */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Quiet Hours Policy
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Suppress automated notifications during late night/early morning hours
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-medium">Start Time</span>
                <input
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-medium">End Time</span>
                <input
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Template & Anti-Spam Guardrails */}
        <div className="space-y-6">
          {/* Anti-Spam Rules Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              Anti-Spam Safety Guardrails
            </h2>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Never send more than configured attempt limit (max 3).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instantly stop automation if payment completes via any channel.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Respect customer opt-out preferences and CRM consent flags.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Never send messages for cancelled or expired order IDs.</span>
              </li>
            </ul>
          </div>

          {/* Template Preview */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Polite Recovery Message Preview
            </h2>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed border border-slate-800 space-y-2">
              <p>Hi Rohan Sharma,</p>
              <p>Your payment for order RF-28491 (₹2,500) was not completed.</p>
              <p>If you would still like to complete your purchase, you can use the secure payment option below:</p>
              <p className="text-blue-400 underline">https://recoverflow.ai/checkout/pay_992?token=demo_sec</p>
              <p className="text-slate-400 text-[11px]">No action is required if you have already completed the payment.</p>
            </div>
            <p className="text-[10px] text-slate-500">
              * Language is strictly neutral and helpful. No threatening or aggressive language used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
