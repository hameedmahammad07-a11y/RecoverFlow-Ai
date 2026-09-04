/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a7f7',
          500: '#0c87e6',
          600: '#026bc4',
          700: '#03559f',
          800: '#074883',
          900: '#0c3c6d',
          950: '#082749',
        },
        dark: {
          bg: '#080C14',
          card: '#0F1626',
          border: '#1E293D',
          hover: '#182339',
          surface: '#131C2E',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};
