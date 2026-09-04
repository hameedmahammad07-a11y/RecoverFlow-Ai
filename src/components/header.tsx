'use client';

import React, { useEffect, useState } from 'react';
import { useEvents } from '@/lib/hooks/use-events';
import { ShieldAlert, Zap, Radio, Bell, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const [activeIncident, setActiveIncident] = useState<any>(null);
  const { isConnected, lastEvent } = useEvents();

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/incidents');
      const data = await res.json();
      if (data.incidents && data.incidents.length > 0) {
        setActiveIncident(data.incidents[0]);
      } else {
        setActiveIncident(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (lastEvent?.type === 'incident.detected') {
      setActiveIncident(lastEvent.data);
    } else if (lastEvent?.type === 'incident.resolved') {
      setActiveIncident(null);
    }
  }, [lastEvent]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Incident Anomaly Ticker Banner or Normal Status */}
      <div className="flex items-center gap-4">
        {activeIncident ? (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold animate-pulse">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              🚨 <strong>PAYMENT ANOMALY DETECTED:</strong> {activeIncident.title} ({activeIncident.currentRate}% failure vs {activeIncident.baselineRate}% baseline)
            </span>
            <Link href="/analytics" className="underline font-bold hover:text-amber-400 ml-1">
              View AI Details
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">● AI Monitoring Active</span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span>NPCI / Razorpay Gateway Latency Normal</span>
          </div>
        )}
      </div>

      {/* Right Quick Controls & Connection Indicator */}
      <div className="flex items-center gap-3">
        {/* Realtime Stream Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400'
              : 'bg-slate-500/10 border-slate-500/30 text-slate-500'
          }`}
        >
          <Radio className={`w-3 h-3 ${isConnected ? 'animate-pulse text-emerald-500' : ''}`} />
          <span>{isConnected ? 'Realtime Stream' : 'Connecting...'}</span>
        </div>

        {/* Demo Lab Trigger Button */}
        <Link
          href="/demo"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/20 transition-all"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Demo Lab</span>
        </Link>
      </div>
    </header>
  );
}
