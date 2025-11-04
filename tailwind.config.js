/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        dark: '#0f172a',
        light: '#f1f5f9',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(45deg, #6366f1, #ec4899)',
        'gradient-2': 'linear-gradient(45deg, #ec4899, #6366f1)',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}


