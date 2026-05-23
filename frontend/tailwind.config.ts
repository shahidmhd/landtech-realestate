import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', xl: '3rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        // luxury palette: deep onyx + champagne gold + ivory
        ink: {
          DEFAULT: '#0A0A0B',
          50: '#F6F6F7',
          100: '#E8E8EA',
          200: '#C9C9CD',
          300: '#9A9AA1',
          400: '#6B6B73',
          500: '#46464C',
          600: '#2A2A2F',
          700: '#1B1B1F',
          800: '#111114',
          900: '#0A0A0B',
        },
        gold: {
          DEFAULT: '#C8A45C',
          50: '#FAF4E5',
          100: '#F1E2B7',
          200: '#E6CC85',
          300: '#D8B566',
          400: '#C8A45C',
          500: '#B28A3F',
          600: '#8E6C2E',
          700: '#6A511F',
          800: '#463614',
          900: '#241B0A',
        },
        ivory: {
          DEFAULT: '#F5F1E8',
          50: '#FDFCF8',
          100: '#F8F5EE',
          200: '#F5F1E8',
          300: '#E9E1CC',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.035em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(135deg, #E6CC85 0%, #C8A45C 45%, #8E6C2E 100%)',
        'hero-fade':
          'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.35) 55%, rgba(10,10,11,0.92) 100%)',
        'radial-spot':
          'radial-gradient(ellipse at center, rgba(200,164,92,0.18) 0%, rgba(10,10,11,0) 60%)',
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.8s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
      },
      boxShadow: {
        luxe: '0 30px 80px -20px rgba(0,0,0,0.55)',
        gold: '0 10px 40px -10px rgba(200,164,92,0.45)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
