import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        phx: {
          crimson: '#C62840',
          'crimson-deep': '#891428',
          bronze: '#C9A55A',
          'bronze-light': '#ECD48E',
          'bronze-dark': '#A07828',
          bg: '#0A0A0A',
          surface: '#141414',
          border: '#1E1E1E',
          text: '#E8E8E8',
          'text-muted': '#888888',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
