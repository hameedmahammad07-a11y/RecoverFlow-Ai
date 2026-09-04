'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export default function DemoLabPage() {
  const [trafficMult, setTrafficMult] = useState(3);
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => {
    setSimLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const handleSimulatePayment = async (status: 'SUCCESS' | 'FAILED' | 'PENDING') => {
    setLoading(true);
    addLog(`Simulating ${status} payment via ${method}...`);
    try {
      const res = await fetch('/api/demo/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PAYMENT',
          status,
          method,
          isKnownCustomer: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addLog(`Payment Event Recorded: ${data.result.id} (${status}) — ₹${data.result.amount}`);
        if (status === 'FAILED') {
          addLog(`Automated Recovery Engine triggered for payment ${data.result.id}.`);
        }
      }
    } catch (e) {
      console.error(e);
      addLog(`Error triggering payment simulation.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateCustomerClick = async () => {
    setLoading(true);
    addLog('Simulating customer tapping recovery link in WhatsApp/SMS...');
    try {
      const res = await fetch('/api/demo/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'RECOVERY_CLICK',
        }),
      });

      const data = await res.json();
      if (data.success) {
        addLog(`Customer payment completed via recovery link! Payment marked RECOVERED.`);
        addLog(`Recovery automation stopped. Verified payment status updated.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateUpiSpike = async () => {
    setLoading(true);
    addLog('Simulating NPCI / Partner Bank UPI failure spike...');
    try {
      const res = await fetch('/api/demo/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'UPI_SPIKE',
        }),
      });

      const data = await res.json();
      if (data.success) {
        addLog(`🚨 ANOMALY ALERT: UPI Failure Rate spiked to 13.8% (baseline 4.0%).`);
        addLog(`AI Investigation label: Possible explanation — High volume traffic switch latency.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTrafficBurst = async () => {
    setLoading(true);
    addLog(`Simulating ${trafficMult}x festival traffic burst...`);
    try {
      const res = await fetch('/api/demo/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TRAFFIC_BURST',
          multiplier: trafficMult,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addLog(`Generated ${data.result.simulatedPaymentsCount} concurrent live transactions.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FlaskConical className="w-6 h-6 text-purple-400" />
          DEMO & SIMULATION LAB
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Interactive simulation hub to trigger live payment failures, customer link clicks, UPI spikes, and festival traffic bursts
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Simulation Controls
          </h2>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Target Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              {(['UPI', 'CARD', 'NETBANKING', 'WALLET'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    method === m
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Single Event Actions */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">1. Trigger Single Payment Events</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSimulatePayment('SUCCESS')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Success</span>
              </button>

              <button
                onClick={() => handleSimulatePayment('FAILED')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Failed</span>
              </button>

              <button
                onClick={() => handleSimulatePayment('PENDING')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </button>
            </div>
          </div>

          {/* Customer Recovery Link Click */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">2. Customer Mode 1 Recovery Action</span>
            <button
              onClick={handleSimulateCustomerClick}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Customer Clicking Recovery Link & Paying</span>
            </button>
          </div>

          {/* UPI Failure Spike Trigger */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">3. Anomaly Incident Simulation</span>
            <button
              onClick={handleSimulateUpiSpike}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Trigger UPI Failure Anomaly Spike (4% -&gt; 13.8%)</span>
            </button>
          </div>

          {/* Festival Traffic Multiplier */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span>4. Traffic Burst Simulator ({trafficMult}x)</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={trafficMult}
                onChange={(e) => setTrafficMult(parseInt(e.target.value, 10))}
                className="flex-1 accent-blue-500"
              />
              <button
                onClick={handleSimulateTrafficBurst}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shrink-0"
              >
                Fire Burst
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulation Console Log */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              Live Simulation Log Console
            </h2>
            <button
              onClick={() => setSimLogs([])}
              className="text-[11px] text-slate-400 hover:text-white underline font-medium"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-1 p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[360px] border border-slate-800">
            {simLogs.length === 0 ? (
              <p className="text-slate-500 italic">No simulation events logged yet. Tap any control on the left to fire simulated events.</p>
            ) : (
              simLogs.map((log, i) => (
                <p key={i} className="leading-relaxed border-b border-slate-900/60 pb-1">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
