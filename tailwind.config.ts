import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          card: '#1a1a24',
          hover: '#22222e',
        },
        accent: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          tertiary: '#a855f7',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
        border: {
          DEFAULT: '#27272a',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        btn: '10px',
        card: '20px',
      },
      keyframes: {
        heroFloat: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-2%, -2%) rotate(1deg)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(5deg)' },
          '50%': { transform: 'translateY(-5px) rotate(0deg)' },
          '75%': { transform: 'translateY(-15px) rotate(-5deg)' },
        },
      },
      animation: {
        heroFloat: 'heroFloat 20s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        'fadeInUp-1': 'fadeInUp 0.6s ease-out 0.1s backwards',
        'fadeInUp-2': 'fadeInUp 0.6s ease-out 0.2s backwards',
        'fadeInUp-3': 'fadeInUp 0.6s ease-out 0.3s backwards',
        'fadeInUp-4': 'fadeInUp 0.6s ease-out 0.4s backwards',
        pulse: 'pulse 2s infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite 1s',
        'float-slower': 'float 7s ease-in-out infinite 2s',
      },
    },
  },
  plugins: [],
};

export default config;
