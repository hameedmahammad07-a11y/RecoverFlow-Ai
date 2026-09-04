import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'RecoverFlow AI — Intelligent Payment Recovery & Failure Prediction',
  description: 'Intelligent Payment Recovery & Failure Prediction for Merchants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 flex">
        <ThemeProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <Header />
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
