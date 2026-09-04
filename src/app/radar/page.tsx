'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radar, ArrowRight, CheckCircle2, AlertTriangle, Send, Sparkles, UserCheck } from 'lucide-react';

const radarStages = [
  { id: '1', title: 'FAILED PAYMENTS', count: 128, color: 'from-red-500 to-rose-600', icon: AlertTriangle, desc: 'Verified raw payment failures' },
  { id: '2', title: 'ELIGIBILITY CHECK', count: 47, color: 'from-amber-500 to-yellow-600', icon: CheckCircle2, desc: 'Consent & attempt limits verified' },
  { id: '3', title: 'RECOVERY INITIATED', count: 31, color: 'from-blue-500 to-cyan-600', icon: Radar, desc: 'Channel strategy selected' },
  { id: '4', title: 'MESSAGE SENT', count: 24, color: 'from-indigo-500 to-blue-600', icon: Send, desc: 'WhatsApp / SMS / Email delivered' },
  { id: '5', title: 'CUSTOMER RESPONSE', count: 19, color: 'from-purple-500 to-indigo-600', icon: UserCheck, desc: 'Customer clicked recovery link' },
  { id: '6', title: 'PAYMENT RECOVERED', count: 16, color: 'from-emerald-500 to-teal-600', icon: Sparkles, desc: 'Purchase completed & automation stopped' },
];

export default function RecoveryRadarPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Radar className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '10s' }} />
          RECOVERY RADAR
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Visual animated pipeline funnel monitoring payment opportunities from failure to recovery completion
        </p>
      </div>

      {/* Main Radar Container */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card shadow-2xl space-y-8 relative overflow-hidden">
        {/* Animated Sweep Line Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/10 to-transparent pointer-events-none animate-pulse" />

        {/* Funnel Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
          {radarStages.map((stage, idx) => {
            const Icon = stage.icon;
            const conversion = idx > 0 ? Math.round((stage.count / radarStages[idx - 1].count) * 100) : 100;

            return (
              <div key={stage.id} className="relative flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-dark-surface/90 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 text-center min-h-[220px]"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${stage.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      STAGE 0{stage.id}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {stage.title}
                    </h3>
                  </div>

                  <div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {stage.count}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                      {stage.desc}
                    </p>
                  </div>

                  {idx > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-emerald-400 font-bold">
                      {conversion}% Retention
                    </div>
                  )}
                </motion.div>

                {/* Arrow Connector for Desktop */}
                {idx < radarStages.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600 dark:text-slate-400">
                    <ArrowRight className="w-5 h-5 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Funnel Efficiency Metrics Summary */}
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">OVERALL FUNNEL RECOVERY RATE</span>
            <span className="text-2xl font-black text-purple-400">34.0%</span>
            <span className="text-[10px] text-slate-500 block">16 Recovered out of 47 Eligible</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">AVERAGE RECOVERY SPEED</span>
            <span className="text-2xl font-black text-blue-400">9.4 Mins</span>
            <span className="text-[10px] text-slate-500 block">From failure to customer payment</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">POTENTIAL UNLOCKED VALUE</span>
            <span className="text-2xl font-black text-emerald-400">₹38,200</span>
            <span className="text-[10px] text-slate-500 block">Recovered purchase opportunity value</span>
          </div>
        </div>
      </div>
    </div>
  );
}
