'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  Send,
  Lock,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CustomerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: any;
  onSuccess?: () => void;
}

export function CustomerPaymentModal({
  isOpen,
  onClose,
  workflow,
  onSuccess,
}: CustomerPaymentModalProps) {
  const [step, setStep] = useState<'MESSAGE' | 'CHECKOUT' | 'SUCCESS'>('MESSAGE');
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !workflow) return null;

  const payment = workflow.payment || workflow;
  const customer = payment.customer || { name: 'Customer', phone: '+91 98765 43210' };
  const amount = payment.amount || 2500;
  const orderNum = payment.order?.orderNumber || payment.id.substring(0, 8);

  const handlePayNow = async () => {
    setProcessing(true);
    try {
      await fetch(`/api/recoveries/${payment.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'COMPLETE_PAYMENT' }),
      });

      setStep('SUCCESS');
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Customer Mobile Screen Simulation
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Smartphone Screen Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {step === 'MESSAGE' && (
              <div className="space-y-4">
                {/* Simulated Notification / WhatsApp Header */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    WA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Apex Store Notifications</p>
                    <p className="text-[10px] text-slate-400">Official Merchant Verified Account</p>
                  </div>
                </div>

                {/* Received Message Bubble */}
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-slate-200 text-xs font-sans space-y-2.5 shadow-inner">
                  <p className="font-semibold text-emerald-300">Hi {customer.name},</p>
                  <p>
                    Your payment for order <strong className="text-white">{orderNum}</strong> (₹
                    {amount.toLocaleString()}) was not completed.
                  </p>
                  <p>
                    If you would still like to complete your purchase, tap below to finish safely:
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setStep('CHECKOUT')}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Payment (₹{amount.toLocaleString()})</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    No action required if payment was already completed.
                  </p>
                </div>
              </div>
            )}

            {step === 'CHECKOUT' && (
              <div className="space-y-4">
                {/* Checkout Header */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Apex Store Checkout
                  </span>
                  <h3 className="text-2xl font-black text-white">₹{amount.toLocaleString()}</h3>
                  <p className="text-[11px] text-slate-400">Order ID: {orderNum}</p>
                </div>

                {/* Method Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Select Payment Method</label>
                  <div className="space-y-2">
                    {[
                      { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                      { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                      { id: 'NETBANKING', label: 'Net Banking', icon: Building2 },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setMethod(item.id as any)}
                          className={`w-full p-3 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                            method === item.id
                              ? 'bg-blue-600/20 text-white border-blue-500'
                              : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-blue-400" />
                            <span>{item.label}</span>
                          </span>
                          {method === item.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handlePayNow}
                  disabled={processing}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{processing ? 'Processing Payment...' : `Pay ₹${amount.toLocaleString()} Now`}</span>
                </button>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-emerald-400">Payment Successful!</h3>
                  <p className="text-xs text-slate-300">₹{amount.toLocaleString()} received for order {orderNum}</p>
                </div>
                <p className="text-[11px] text-emerald-300 font-medium bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40">
                  🎉 Merchant Overview Dashboard and Recovery Command Center updated in real-time!
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                >
                  Close Mobile Simulator
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
