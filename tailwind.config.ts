import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#F4D03F',
          accent: '#D4AF37',
        },
        gray: {
          bg: '#F5F5F5',
          border: '#E0E0E0',
          text: '#757575',
        },
        black: {
          DEFAULT: '#1A1A1A',
        },
        success: '#4CAF50',
        error: '#EF4444',
        warning: '#FF9800',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config