'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  PhoneCall,
  Mail,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  AlertTriangle,
  Sparkles,
  Download,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils/export';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const channels = data?.channels || [
    { channel: 'WhatsApp', attempts: 184, successfulRecoveries: 62, recoveryRate: '33.7%', avgTimeMinutes: 8.5, msgCost: 138, recoveredVal: 92400 },
    { channel: 'SMS', attempts: 96, successfulRecoveries: 24, recoveryRate: '25.0%', avgTimeMinutes: 14.2, msgCost: 24, recoveredVal: 64500 },
    { channel: 'Email', attempts: 68, successfulRecoveries: 12, recoveryRate: '17.6%', avgTimeMinutes: 42.0, msgCost: 3.4, recoveredVal: 33000 },
  ];

  const paymentMethods = data?.paymentMethods || [
    { method: 'UPI', totalVolume: 840, successRate: '92.4%', failRate: '7.6%', recoveredCount: 48, recoveredValue: 64200 },
    { method: 'Cards', totalVolume: 320, successRate: '97.8%', failRate: '2.2%', recoveredCount: 18, recoveredValue: 89400 },
    { method: 'Net Banking', totalVolume: 94, successRate: '95.1%', failRate: '4.9%', recoveredCount: 9, recoveredValue: 31500 },
    { method: 'Wallets', totalVolume: 30, successRate: '96.6%', failRate: '3.4%', recoveredCount: 3, recoveredValue: 4800 },
  ];

  const failureReasons = data?.failureReasons || [
    { reason: 'Bank Server Timeout', count: 54, percentage: '42.2%' },
    { reason: 'Expired User Session', count: 28, percentage: '21.8%' },
    { reason: 'Authentication Failed', count: 22, percentage: '17.2%' },
    { reason: 'Insufficient Funds', count: 14, percentage: '10.9%' },
    { reason: 'Network Flap', count: 10, percentage: '7.8%' },
  ];

  const handleExportCSV = () => {
    const rows = paymentMethods.map((pm: any) => ({
      PaymentMethod: pm.method,
      TotalVolume: pm.totalVolume,
      SuccessRate: pm.successRate,
      FailureRate: pm.failRate,
      RecoveredCount: pm.recoveredCount,
      RecoveredValue: pm.recoveredValue,
    }));
    exportToCSV(`RecoverFlow_Analytics_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            ADVANCED PAYMENT ANALYTICS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Channel conversion efficiency, payment gateway health breakdown, and root cause distributions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Channel ROI & Cost Optimizer Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Recovery Channel ROI & Messaging Cost Optimizer
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-extrabold uppercase">
            Net Profit Optimizer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">TOTAL MESSAGING COST</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">₹165.40</span>
            <span className="text-[10px] text-slate-500 block">348 total messages sent</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">GROSS RECOVERY VALUE</span>
            <span className="text-2xl font-black text-purple-400">₹1,89,900</span>
            <span className="text-[10px] text-slate-500 block">98 total recovered opportunities</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">NET RECOVERED PROFIT</span>
            <span className="text-2xl font-black text-emerald-400">₹1,89,734.60</span>
            <span className="text-[10px] text-emerald-500 block font-bold">1,147x Messaging ROI Multiplier</span>
          </div>
        </div>
      </div>

      {/* Channel Comparison Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Recovery Channel Performance Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((ch: any) => {
            const isWA = ch.channel === 'WhatsApp';
            const isSMS = ch.channel === 'SMS';
            const Icon = isWA ? MessageSquare : isSMS ? PhoneCall : Mail;
            const color = isWA ? 'text-emerald-400' : isSMS ? 'text-blue-400' : 'text-purple-400';

            return (
              <motion.div
                key={ch.channel}
                whileHover={{ y: -2 }}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ch.channel}</h3>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                    {ch.recoveryRate} Rate
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">Total Attempts</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{ch.attempts}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">Recovered</span>
                    <span className="text-base font-extrabold text-emerald-400">{ch.successfulRecoveries}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Avg Time to Recovery:</span>
                  <span className="font-bold text-slate-200">{ch.avgTimeMinutes} mins</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Payment Method Health & Failure Reasons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            Payment Method Performance
          </h2>

          <div className="space-y-3">
            {paymentMethods.map((pm: any) => (
              <div key={pm.method} className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{pm.method}</h4>
                  <p className="text-[10px] text-slate-400">Total Volume: {pm.totalVolume} txns</p>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Success Rate</span>
                    <span className="font-extrabold text-emerald-400">{pm.successRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Recovered</span>
                    <span className="font-extrabold text-purple-400">₹{pm.recoveredValue?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Reasons Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Top Payment Failure Reasons Distribution
          </h2>

          <div className="space-y-3">
            {failureReasons.map((fr: any) => (
              <div key={fr.reason} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{fr.reason}</span>
                  <span className="text-slate-900 dark:text-white font-mono">{fr.count} ({fr.percentage})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    style={{ width: fr.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
