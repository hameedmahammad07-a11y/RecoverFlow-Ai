'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './theme-provider';
import {
  LayoutDashboard,
  Activity,
  ShieldAlert,
  Bot,
  QrCode,
  TrendingUp,
  BarChart3,
  FlaskConical,
  Settings,
  Sun,
  Moon,
  Radar,
  Sparkles,
  Webhook,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Live Payments', href: '/live-payments', icon: Activity },
  { name: 'Recovery Center', href: '/recovery', icon: ShieldAlert },
  { name: 'Recovery Automation', href: '/recovery-automation', icon: Bot },
  { name: 'Instant Checkout', href: '/instant-checkout', icon: QrCode },
  { name: 'Predictions', href: '/predictions', icon: TrendingUp },
  { name: 'Recovery Radar', href: '/radar', icon: Radar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Webhook Playground', href: '/webhooks', icon: Webhook },
  { name: 'Demo Lab', href: '/demo', icon: FlaskConical, highlight: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                RECOVERFLOW <span className="text-blue-500 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 font-extrabold">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[150px]">
                Intelligent Payment Recovery
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                    : item.highlight
                    ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 bg-purple-500/5 border border-purple-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-purple-500' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold uppercase tracking-wider">
                    Sim
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Theme Toggle */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-slate-500">
            {theme.toUpperCase()}
          </span>
        </button>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
            AV
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">Alex Vance</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Apex Global Store</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
