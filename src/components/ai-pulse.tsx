'use client';

import React from 'react';
import { Activity, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AIPulseProps {
  data?: {
    now: {
      status: string;
      summary: string;
      badgeColor: string;
    };
    next: {
      title: string;
      summary: string;
      riskScore: number;
    };
    action: {
      title: string;
      steps: string[];
    };
  };
}

export function AIPulse({ data }: AIPulseProps) {
  const nowData = data?.now || {
    status: 'STABLE',
    summary: 'Payment performance stable. 23 uncompleted purchase opportunities currently eligible for recovery.',
    badgeColor: 'emerald',
  };

  const nextData = data?.next || {
    title: 'Diwali Sale Traffic Surge Expected',
    summary: '3.2x traffic multiplier anticipated tomorrow between 7:00 PM – 10:00 PM IST.',
    riskScore: 68,
  };

  const actionData = data?.action || {
    title: 'Recommended Merchant Preparation',
    steps: [
      'Keep automated multi-channel WhatsApp recovery active',
      'Verify payment gateway webhook health and server socket capacity',
      'Configure instant retry options for POS anonymous customers',
    ],
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-dark-card/60 shadow-xl relative overflow-hidden">
      {/* Header Title */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              AI PULSE
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-extrabold uppercase tracking-wider">
                Live Intelligence
              </span>
            </h3>
          </div>
        </div>
        <Link href="/predictions" className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1">
          Full Risk Forecast <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Three Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NOW */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface/80 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                NOW
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                nowData.badgeColor === 'amber'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-emerald-500/20 text-emerald-500'
              }`}>
                {nowData.status}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {nowData.summary}
            </p>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Realtime Payment Event Stream
          </div>
        </div>

        {/* NEXT */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface/80 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                NEXT
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                Risk {nextData.riskScore}%
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
              {nextData.title}
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {nextData.summary}
            </p>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Next 24h Predictive Analysis
          </div>
        </div>

        {/* ACTION */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface/80 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                ACTION
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                Merchant Prep
              </span>
            </div>
            <ul className="space-y-1.5">
              {actionData.steps.slice(0, 3).map((step, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-indigo-500 font-bold text-[10px] shrink-0 mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            AI Automated Recommendations
          </div>
        </div>
      </div>
    </div>
  );
}
