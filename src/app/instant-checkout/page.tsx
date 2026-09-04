'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
} from 'lucide-react';

export default function InstantCheckoutPage() {
  const [amount, setAmount] = useState('50');
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [verificationState, setVerificationState] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'PENDING' | 'FAILED'>('IDLE');
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleStartPaymentVerification = async (simulatedResult: 'PENDING' | 'SUCCESS' | 'FAILED') => {
    setVerificationState('VERIFYING');
    setStatusMessage('Verifying actual payment status with bank gateway...');

    // Call instant-checkout verification API
    try {
      const res = await fetch('/api/instant-checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount) || 50,
          paymentMethod: method,
        }),
      });

      const data = await res.json();
      setActivePaymentId(data.paymentId);

      // Simulate verification delay
      setTimeout(async () => {
        if (simulatedResult === 'SUCCESS') {
          // Complete payment
          if (data.paymentId) {
            await fetch(`/api/recoveries/${data.paymentId}/action`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'COMPLETE_PAYMENT' }),
            });
          }
          setVerificationState('SUCCESS');
          setStatusMessage('PAYMENT CONFIRMED. DO NOT ASK CUSTOMER TO PAY AGAIN.');
        } else if (simulatedResult === 'PENDING') {
          setVerificationState('PENDING');
          setStatusMessage('Payment confirmation pending. Please wait while we verify with bank gateway.');
        } else {
          setVerificationState('FAILED');
          setStatusMessage('Payment not completed by issuing bank.');
        }
      }, 1500);
    } catch (e) {
      console.error(e);
      setVerificationState('FAILED');
    }
  };

  const handleResetState = () => {
    setVerificationState('IDLE');
    setActivePaymentId(null);
    setStatusMessage('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <QrCode className="w-6 h-6 text-purple-400" />
          INSTANT CHECKOUT RECOVERY (MODE 2)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Designed for POS systems, physical stores, QR payments, and anonymous in-person customers
        </p>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Terminal Input Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span>POS Transaction Input</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-extrabold uppercase">
              Mode 2 Active
            </span>
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Transaction Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={verificationState !== 'IDLE'}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl text-base font-extrabold bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UPI', label: 'UPI QR', icon: Smartphone },
                { id: 'CARD', label: 'POS Card', icon: CreditCard },
                { id: 'NETBANKING', label: 'NetBank', icon: Lock },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id as any)}
                    disabled={verificationState !== 'IDLE'}
                    className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                      method === item.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Simulate Gateway Verification State:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStartPaymentVerification('SUCCESS')}
                disabled={verificationState === 'VERIFYING'}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                Test Success
              </button>
              <button
                onClick={() => handleStartPaymentVerification('PENDING')}
                disabled={verificationState === 'VERIFYING'}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
              >
                Test Pending
              </button>
              <button
                onClick={() => handleStartPaymentVerification('FAILED')}
                disabled={verificationState === 'VERIFYING'}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              >
                Test Failed
              </button>
            </div>
          </div>
        </div>

        {/* Verification & Instant Recovery Screen Display */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Customer Screen Verification State
            </h3>
            {verificationState !== 'IDLE' && (
              <button
                onClick={handleResetState}
                className="text-xs text-slate-400 hover:text-white underline font-medium"
              >
                Reset Screen
              </button>
            )}
          </div>

          {/* State Machine Display */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200 dark:border-slate-800 text-center min-h-[220px]">
            {verificationState === 'IDLE' && (
              <div className="space-y-2">
                <QrCode className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs font-semibold text-slate-400">Ready for POS Transaction</p>
                <p className="text-[10px] text-slate-500">Tap one of the test actions above to simulate verification</p>
              </div>
            )}

            {verificationState === 'VERIFYING' && (
              <div className="space-y-3">
                <Clock className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">VERIFYING PAYMENT STATE</p>
                <p className="text-xs text-blue-400">{statusMessage}</p>
              </div>
            )}

            {verificationState === 'SUCCESS' && (
              <div className="space-y-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 w-full">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-extrabold text-emerald-400">PAYMENT CONFIRMED — ₹{amount}</h4>
                <p className="text-xs text-emerald-300 font-bold bg-emerald-950/60 py-1.5 px-3 rounded-lg border border-emerald-500/40">
                  🔒 SAFETY LOCK: DO NOT ASK CUSTOMER TO PAY AGAIN.
                </p>
              </div>
            )}

            {verificationState === 'PENDING' && (
              <div className="space-y-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 w-full">
                <Clock className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                <h4 className="text-base font-extrabold text-amber-400">CONFIRMATION PENDING</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Please wait while we confirm with the bank. Do not issue a new payment request yet."
                </p>
              </div>
            )}

            {verificationState === 'FAILED' && (
              <div className="space-y-4 w-full text-left">
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-1" />
                  <h4 className="text-sm font-bold text-red-400">PAYMENT NOT COMPLETED (₹{amount})</h4>
                  <p className="text-[11px] text-slate-400">Select Instant Recovery Option Below:</p>
                </div>

                {/* Instant Recovery Options */}
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleStartPaymentVerification('SUCCESS')}
                    className="w-full p-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-between"
                  >
                    <span>1. Recheck Status After Verification</span>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleStartPaymentVerification('SUCCESS')}
                    className="w-full p-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-between"
                  >
                    <span>2. Generate Fresh Payment Request</span>
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleStartPaymentVerification('SUCCESS')}
                    className="w-full p-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-between"
                  >
                    <span>3. Show New Payment QR Code</span>
                    <QrCode className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleStartPaymentVerification('SUCCESS')}
                    className="w-full p-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-between"
                  >
                    <span>4. Accept Cash Payment</span>
                    <Banknote className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
