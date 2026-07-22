/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1e0b36',
          purple: '#6b21a8',
          magenta: '#c026d3',
          blue: '#2563eb',
          light: '#fdf4ff',
        },
      },
    },
  },
  plugins: [],
};
