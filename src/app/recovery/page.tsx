'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Bot,
  Send,
  StopCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  MessageSquare,
  Mail,
  PhoneCall,
  User,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import { CustomerPaymentModal } from '@/components/customer-payment-modal';

export default function RecoveryCenterPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRecoveries = async () => {
    try {
      const res = await fetch('/api/recoveries');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecoveries();
  }, []);

  const handleTriggerAttempt = async (paymentId: string, channelOverride?: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/recoveries/${paymentId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'START_ATTEMPT',
          channelOverride,
        }),
      });
      await fetchRecoveries();
      setSelectedWorkflow(null);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopAutomation = async (paymentId: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/recoveries/${paymentId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'STOP_AUTOMATION',
          reason: 'MANUAL_STOP_BY_MERCHANT',
        }),
      });
      await fetchRecoveries();
      setSelectedWorkflow(null);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const metrics = data?.metrics || {
    failedToday: 128,
    eligibleForRecovery: 47,
    recoveryInProgress: 19,
    recoveredCount: 16,
    stoppedCount: 12,
    recoveredValueTotal: 38200,
    potentialValueTotal: 124500,
  };

  const queue = data?.queue || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-indigo-500" />
            RECOVERY COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mode 1 Known Customer Recovery engine with consent verification & anti-spam attempt limits
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">FAILED TODAY</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.failedToday}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">ELIGIBLE</span>
          <span className="text-2xl font-extrabold text-blue-500">{metrics.eligibleForRecovery}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">IN PROGRESS</span>
          <span className="text-2xl font-extrabold text-amber-500">{metrics.recoveryInProgress}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">RECOVERED</span>
          <span className="text-2xl font-extrabold text-purple-400">{metrics.recoveredCount}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">STOPPED</span>
          <span className="text-2xl font-extrabold text-slate-400">{metrics.stoppedCount}</span>
        </div>
      </div>

      {/* Recovery Queue List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Active Recovery Queue
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
            {queue.length} Opportunities
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queue.map((item: any) => {
            const isCompleted = item.status === 'COMPLETED' || item.payment.status === 'RECOVERED';
            const isStopped = item.status === 'STOPPED';

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {item.payment.order?.orderNumber || item.payment.id.substring(0, 10)}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {item.payment.customer?.name || 'Known Customer'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{item.payment.amount?.toLocaleString()}
                      </span>
                      <span className="text-[10px] block text-slate-400">{item.payment.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Status & Scores */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Recovery Score:</span>
                      <span className="font-extrabold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                        {item.recoveryScore}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Channel:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        {item.recommendedChannel === 'WHATSAPP' && <MessageSquare className="w-3 h-3 text-emerald-400" />}
                        {item.recommendedChannel === 'SMS' && <PhoneCall className="w-3 h-3 text-blue-400" />}
                        {item.recommendedChannel === 'EMAIL' && <Mail className="w-3 h-3 text-purple-400" />}
                        {item.recommendedChannel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Attempt Progress:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-200">
                        {item.currentAttempts} / {item.maxAttempts}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        isCompleted
                          ? 'bg-purple-500/20 text-purple-400'
                          : isStopped
                          ? 'bg-slate-500/20 text-slate-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Trigger Action Button */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  {!isCompleted && !isStopped && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTriggerAttempt(item.paymentId, item.recommendedChannel)}
                        disabled={actionLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedWorkflow(item);
                          setPreviewModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center gap-1 transition-all"
                        title="Preview Customer Mobile Screen"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="w-full py-2 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-400 text-center flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Payment Recovered</span>
                    </div>
                  )}

                  {isStopped && (
                    <div className="w-full py-2 rounded-xl text-xs font-bold bg-slate-500/10 text-slate-400 text-center">
                      <span>Automation Stopped ({item.stopReason})</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Customer Mobile Experience Simulator Modal */}
      <CustomerPaymentModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        workflow={selectedWorkflow}
        onSuccess={fetchRecoveries}
      />
    </div>
  );
}
