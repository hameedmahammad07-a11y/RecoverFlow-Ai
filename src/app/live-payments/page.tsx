'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useEvents } from '@/lib/hooks/use-events';

export default function LivePaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { lastEvent } = useEvents();

  const fetchPayments = async () => {
    try {
      let url = `/api/payments?limit=50`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      if (methodFilter !== 'ALL') url += `&method=${methodFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      setPayments(data.payments || []);
      setLoading(false);
    } catch (e) {
      console.error('Failed to fetch live payments:', e);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, methodFilter, searchQuery]);

  // Real-time update when new payment arrives
  useEffect(() => {
    if (lastEvent) {
      fetchPayments();
    }
  }, [lastEvent]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
            Live Payment Event Stream
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
              ● Live WebSockets / SSE
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time transaction stream with automated status verification & failure highlights
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Txn ID, Customer, Order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Method & Status Selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
              <option value="PENDING">PENDING</option>
              <option value="RECOVERED">RECOVERED</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none font-medium"
            >
              <option value="ALL">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="NETBANKING">Net Banking</option>
              <option value="WALLET">Wallet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-dark-surface border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Customer / Mode</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Recovery Workflow</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              <AnimatePresence>
                {payments.map((p) => {
                  const isFailed = p.status === 'FAILED';
                  const isRecovered = p.status === 'RECOVERED';
                  const isSuccess = p.status === 'SUCCESS';
                  const isPending = p.status === 'PENDING';

                  const workflow = p.recoveryWorkflow;

                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`transition-colors ${
                        isFailed
                          ? 'bg-red-500/5 hover:bg-red-500/10 dark:bg-red-950/20 dark:hover:bg-red-900/30'
                          : isRecovered
                          ? 'bg-purple-500/5 hover:bg-purple-500/10 dark:bg-purple-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Txn ID */}
                      <td className="p-4 font-mono font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{p.order?.orderNumber || p.id.substring(0, 10)}</span>
                        </div>
                      </td>

                      {/* Customer / Mode */}
                      <td className="p-4">
                        {p.customer ? (
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{p.customer.name}</p>
                            <p className="text-[10px] text-slate-400">{p.customer.phone || p.customer.email}</p>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              Anonymous POS
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white">
                        ₹{p.amount?.toLocaleString()}
                      </td>

                      {/* Method */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-dark-surface font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[11px]">
                          {p.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> SUCCESS
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                            <AlertTriangle className="w-3 h-3" /> FAILED
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3 animate-spin" /> PENDING
                          </span>
                        )}
                        {isRecovered && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                            <Sparkles className="w-3 h-3" /> RECOVERED
                          </span>
                        )}
                      </td>

                      {/* Recovery Status */}
                      <td className="p-4">
                        {workflow ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {workflow.status} ({workflow.currentAttempts}/{workflow.maxAttempts})
                            </span>
                            <span className="text-[10px] text-slate-400">{workflow.recommendedChannel}</span>
                          </div>
                        ) : isFailed ? (
                          <span className="text-[10px] text-amber-400 font-semibold">Eligible for Recovery</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">—</span>
                        )}
                      </td>

                      {/* Time */}
                      <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
