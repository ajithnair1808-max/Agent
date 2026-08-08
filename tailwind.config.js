/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        dark: {
          base: '#090d16',
          card: '#111827',
          panel: '#1f293d',
          border: '#374151',
          hover: '#1f2937',
        },
        accent: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(34, 197, 94, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
