/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#5e17eb',
        'brand-purple-light': '#8b5cf6',
        'brand-gold': '#ffdd27',
        'brand-gold-warm': '#ffc107',
      },
    },
  },
  plugins: [],
}
