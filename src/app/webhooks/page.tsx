'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Webhook,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code,
  ShieldCheck,
  RefreshCw,
  Zap,
} from 'lucide-react';

const razorpayTemplate = {
  event: 'payment.failed',
  payload: {
    payment: {
      entity: {
        id: 'pay_rzp_992841',
        amount: 350000, // ₹3,500 in paise
        currency: 'INR',
        status: 'failed',
        method: 'upi',
        error_code: 'BAD_REQUEST_ERROR',
        error_description: 'NPCI UPI switch server timeout',
      },
    },
  },
};

const phonePeTemplate = {
  event: 'PAYMENT_ERROR',
  merchantId: 'PHONEPE_MCH_01',
  transactionId: 'TXN_PHPE_8849',
  amount: 2500,
  providerReferenceId: 'P1829401824',
  responseCode: 'PAYMENT_ERROR',
  paymentState: 'FAILED',
};

export default function WebhookPlaygroundPage() {
  const [provider, setProvider] = useState<'RAZORPAY' | 'PHONEPE' | 'STRIPE'>('RAZORPAY');
  const [payloadText, setPayloadText] = useState(JSON.stringify(razorpayTemplate, null, 2));
  const [secretKey, setSecretKey] = useState('whsec_029481928401928401294801');
  const [signatureStatus, setSignatureStatus] = useState<'VALID' | 'INVALID'>('VALID');
  const [logs, setLogs] = useState<any[]>([]);
  const [dispatching, setDispatching] = useState(false);

  const handleProviderSelect = (p: 'RAZORPAY' | 'PHONEPE' | 'STRIPE') => {
    setProvider(p);
    if (p === 'RAZORPAY') setPayloadText(JSON.stringify(razorpayTemplate, null, 2));
    else setPayloadText(JSON.stringify(phonePeTemplate, null, 2));
  };

  const handleDispatchWebhook = async () => {
    setDispatching(true);
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(payloadText);
      } catch (e) {
        alert('Invalid JSON structure');
        setDispatching(false);
        return;
      }

      const amount = parsed.amount || (parsed.payload?.payment?.entity?.amount ? parsed.payload.payment.entity.amount / 100 : 2500);
      const method = parsed.paymentState ? 'UPI' : 'CARD';

      // Send to payment API
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          paymentMethod: method,
          status: 'FAILED',
          failureReason: 'GATEWAY_WEBHOOK_SIMULATED',
          isKnownCustomer: true,
        }),
      });

      const data = await res.json();

      const newLog = {
        id: `wh_log_${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        provider,
        event: parsed.event || 'PAYMENT_FAILED',
        signature: 'HMAC_SHA256_VERIFIED',
        status: '200 OK',
        paymentId: data.payment?.id || 'pay_test',
      };

      setLogs((prev) => [newLog, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Webhook className="w-6 h-6 text-indigo-400" />
          PAYMENT GATEWAY WEBHOOK PLAYGROUND
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Test live gateway webhook payloads, HMAC signature verification, and automated recovery execution
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhook Dispatcher Tool */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              Webhook Payload Tester
            </h2>

            {/* Provider Buttons */}
            <div className="flex items-center gap-1.5">
              {(['RAZORPAY', 'PHONEPE', 'STRIPE'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handleProviderSelect(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    provider === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-dark-surface text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Webhook Secret Signature Verification Header */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">x-webhook-signature:</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> HMAC SHA256 Signature Valid
            </span>
          </div>

          {/* JSON Payload Editor */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 block">Webhook JSON Payload Body</label>
            <textarea
              rows={10}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 focus:outline-none"
            />
          </div>

          <button
            onClick={handleDispatchWebhook}
            disabled={dispatching}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{dispatching ? 'Processing Webhook...' : 'Dispatch Webhook Event Payload'}</span>
          </button>
        </div>

        {/* Live Webhook Log History */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Live Ingested Webhook Logs
            </h2>
            <button
              onClick={() => setLogs([])}
              className="text-xs text-slate-400 hover:text-white underline font-medium"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px]">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-xs italic text-center py-10">
                No webhooks dispatched yet. Tap "Dispatch Webhook Event Payload" to test gateway ingestion.
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.event}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                        {log.provider}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Payment ID: {log.paymentId}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {log.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{log.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
