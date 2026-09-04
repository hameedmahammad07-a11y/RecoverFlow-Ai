'use client';

import React, { useState } from 'react';
import { QrCode, Copy, Share2, Check, Zap, Link as LinkIcon } from 'lucide-react';

export function QuickLinkGenerator() {
  const [amount, setAmount] = useState('1500');
  const [recipient, setRecipient] = useState('+91 98765 43210');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const link = `https://recoverflow.ai/checkout/pay_${Math.floor(1000 + Math.random() * 8999)}?amt=${amount}`;
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Quick Recovery Link & QR Generator
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-extrabold uppercase">
          Over-The-Counter
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Customer Phone / Email</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
      >
        Generate Instant Recovery Link
      </button>

      {generatedLink && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-400 font-mono truncate">
            <span className="truncate">{generatedLink}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Link copied! Customer will receive automated payment verification upon completion.
          </p>
        </div>
      )}
    </div>
  );
}
