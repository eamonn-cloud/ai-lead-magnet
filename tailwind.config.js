/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        navy: {
          deepest: '#040f3d',
          dark:    '#001C61',
          mid:     '#002e7f',
          DEFAULT: '#005eb7',
        },
        blue: {
          primary: '#005eb7',
          light:   '#0067B6',
        },
        cyan:  '#B9FAF8',
        orange: {
          DEFAULT: '#F97316',
          bright:  '#FB923C',
          glow:    '#F97316',
        },
        slate: '#4B5964',
        pink:  '#A8407E',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #040f3d 0%, #001C61 50%, #002e7f 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,94,183,0.15) 0%, rgba(0,28,97,0.4) 100%)',
        'blue-glow':     'radial-gradient(ellipse at center, rgba(0,94,183,0.3) 0%, transparent 70%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan':       'scan 2s linear infinite',
        'progress':   'progress 25s ease-in-out forwards',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        progress: {
          '0%':   { width: '0%' },
          '20%':  { width: '25%' },
          '50%':  { width: '60%' },
          '80%':  { width: '85%' },
          '100%': { width: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'blue-glow':   '0 0 40px rgba(0,94,183,0.4)',
        'orange-glow': '0 0 40px rgba(249,115,22,0.4)',
        'card':        '0 4px 24px rgba(4,15,61,0.6)',
        'inner-glow':  'inset 0 1px 0 rgba(185,250,248,0.1)',
      },
    },
  },
  plugins: [],
}
