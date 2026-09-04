'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AIPulse } from '@/components/ai-pulse';
import { QuickLinkGenerator } from '@/components/quick-link-generator';
import { useEvents } from '@/lib/hooks/use-events';

export default function OverviewDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const { lastEvent } = useEvents();

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  // Update on real-time SSE payment event
  useEffect(() => {
    if (lastEvent) {
      fetchDashboardData();
    }
  }, [lastEvent]);

  const metrics = data?.metrics || {
    liveEarnings: 482450,
    totalTransactions: 1284,
    failedPaymentsCount: 128,
    failedAboveBaseline: 8,
    recoveredValue: 38200,
    potentialRecoveryValue: 124500,
    eligibleRecoveryCount: 23,
    paymentSuccessRate: '92.6%',
  };

  const health = data?.paymentHealth || {
    upi: { successRate: '92.4%', status: 'WARNING', failRate: '7.6%' },
    cards: { successRate: '97.8%', status: 'HEALTHY', failRate: '2.2%' },
    netBanking: { successRate: '95.1%', status: 'HEALTHY', failRate: '4.9%' },
  };

  const chartData = data?.timeSeries || [
    { time: '00:00', revenue: 14200, successCount: 14, failCount: 1 },
    { time: '04:00', revenue: 42100, successCount: 42, failCount: 3 },
    { time: '08:00', revenue: 128400, successCount: 130, failCount: 9 },
    { time: '12:00', revenue: 264000, successCount: 280, failCount: 18 },
    { time: '16:00', revenue: 389000, successCount: 410, failCount: 29 },
    { time: '20:00', revenue: 452000, successCount: 475, failCount: 35 },
    { time: 'NOW', revenue: metrics.liveEarnings, successCount: 520, failCount: 41 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Greeting & AI Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Good evening, Alex 👋
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              ● AI Monitoring Active
            </span>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl">
            Your payment health is stable today. However,{' '}
            <strong className="text-amber-400 font-bold">
              {metrics.eligibleRecoveryCount} failed transactions
            </strong>{' '}
            are currently eligible for automated recovery.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Potential Recovery Value
            </span>
            <span className="text-lg font-extrabold text-emerald-400">
              ₹{metrics.potentialRecoveryValue?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Live Earnings */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>LIVE EARNINGS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ₹{metrics.liveEarnings?.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Real-time earnings ticker active</span>
          </div>
        </motion.div>

        {/* Metric 2: Total Transactions */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>TOTAL TRANSACTIONS</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {metrics.totalTransactions?.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Success Rate: <strong className="text-emerald-400">{metrics.paymentSuccessRate}</strong>
          </div>
        </motion.div>

        {/* Metric 3: Failed Payments */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>FAILED PAYMENTS</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {metrics.failedPaymentsCount}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-500 font-semibold">
            <span>+{metrics.failedAboveBaseline} above normal baseline</span>
          </div>
        </motion.div>

        {/* Metric 4: Recovered Value */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>RECOVERED VALUE</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400 tracking-tight">
            ₹{metrics.recoveredValue?.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Value from recovered payment opportunities
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid: Live Earnings Graph & Payment Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Earnings Interactive Graph (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Live Earnings & Revenue Stream
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  ● Realtime
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gross processed revenue over time with failure overlay
              </p>
            </div>

            {/* Time Filter Buttons: 1H, 6H, 24H, 7D */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-dark-surface p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start">
              {(['1H', '6H', '24H', '7D'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === r
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Rendering */}
          <div className="h-72 w-full pt-2">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293D" opacity={0.5} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F1626',
                      borderColor: '#1E293D',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Payment Health Section (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Payment Health
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                  By Gateway
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Method-level success rates vs baseline thresholds
              </p>
            </div>

            <div className="space-y-4">
              {/* UPI */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">UPI Payments</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                      {health.upi.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Failure rate: {health.upi.failRate} (baseline 4.0%)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-amber-400">{health.upi.successRate}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Cards</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {health.cards.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Failure rate: {health.cards.failRate} (baseline 2.2%)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400">{health.cards.successRate}</span>
                </div>
              </div>

              {/* Net Banking */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Net Banking</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {health.netBanking.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Failure rate: {health.netBanking.failRate} (baseline 4.8%)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400">{health.netBanking.successRate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Automated Failover Guard</span>
            <span className="text-emerald-400 font-semibold">Enabled</span>
          </div>
        </div>
      </div>

      {/* Quick Link Generator Widget */}
      <QuickLinkGenerator />

      {/* AI Pulse Section */}
      <AIPulse data={data?.aiPulse} />
    </div>
  );
}
