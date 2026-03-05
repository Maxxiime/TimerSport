/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gymbg: '#0f0f0f',
        work: '#22c55e',
        rest: '#3b82f6',
        warning: '#ef4444',
      },
      boxShadow: {
        glow: '0 0 40px rgba(239, 68, 68, 0.45)',
      },
    },
  },
  plugins: [],
}
