'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Zap,
  BarChart,
  ShieldCheck,
} from 'lucide-react';

export default function PredictionsPage() {
  const [forecast, setForecast] = useState<any>(null);
  const [eventName, setEventName] = useState('Diwali Lightning Sale');
  const [trafficMultiplier, setTrafficMultiplier] = useState(3);
  const [vulnerableMethod, setVulnerableMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    try {
      const res = await fetch('/api/predictions');
      const data = await res.json();
      setForecast(data.forecast);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const handleRunEventForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/predictions/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          targetDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          expectedTrafficMultiplier: trafficMultiplier,
          vulnerableMethod,
        }),
      });

      const data = await res.json();
      if (data.forecast) {
        setForecast(data.forecast);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const factors = forecast?.contributingFactors || [
    'Expected 3.2x traffic surge during festival lightning deal sale',
    'NPCI UPI bank handle contention rate typically spikes under high concurrency',
    'Card OTP SMS delay probability increases by 14%',
  ];

  const recommendations = forecast?.recommendations || [
    'Enable enhanced monitoring before 7:00 PM',
    'Review UPI payment performance and partner bank switch latencies',
    'Configure early failure alerts and automated WhatsApp recovery escalation',
    'Verify payment gateway webhook health and server socket capacity',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            PAYMENT RISK FORECAST
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explainable AI risk scoring, festival traffic multipliers, and merchant preparation checklists
          </p>
        </div>
      </div>

      {/* Main Grid: Forecast Display & Event Simulation Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Card (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                TARGET PERIOD: {forecast?.period || 'NEXT 24 HOURS'}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Failure Risk Forecast Analysis
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                (forecast?.overallRiskScore || 18) > 60
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {forecast?.riskLevel || 'LOW RISK'} ({forecast?.overallRiskScore || 18.4}%)
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">EXPECTED TRAFFIC</span>
              <span className="text-lg font-extrabold text-blue-400">
                {forecast?.trafficMultiplier || 1.2}x Normal
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">MOST VULNERABLE</span>
              <span className="text-lg font-extrabold text-amber-400">
                {forecast?.vulnerableMethod || 'UPI'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">EXPECTED PEAK</span>
              <span className="text-xs font-extrabold text-purple-400 mt-1 block">
                {forecast?.expectedPeak || '7:30 PM - 9:30 PM'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">AI CONFIDENCE</span>
              <span className="text-lg font-extrabold text-emerald-400">
                {forecast?.confidence || 82.5}%
              </span>
            </div>
          </div>

          {/* Contributing Factors */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Contributing Factors (AI Analysis)
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {factors.map((factor: string, idx: number) => (
                <li key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800/80 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Preparation Recommendations Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Preparation Plan Recommendations
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Festival / Event Forecast Creator Tool (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-xl space-y-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            Upcoming Event Risk Simulator
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Expected Traffic Multiplier ({trafficMultiplier}x)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={trafficMultiplier}
                onChange={(e) => setTrafficMultiplier(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1x Normal</span>
                <span>3x High</span>
                <span>5x Extreme</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Vulnerable Payment Method</label>
              <select
                value={vulnerableMethod}
                onChange={(e) => setVulnerableMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="UPI">UPI</option>
                <option value="CARD">Cards</option>
                <option value="NETBANKING">Net Banking</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunEventForecast}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing Event Data...' : 'Run Event Forecast Analysis'}
          </button>
        </div>
      </div>
    </div>
  );
}
