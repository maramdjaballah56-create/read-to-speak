/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#FFFFFF',
        panel: '#F6F5FB',
        purple: {
          light: '#EDE9FE',
          DEFAULT: '#9B87F0',
          dark: '#7C6AE0',
        },
        ink: '#1F2126',
        muted: '#6B7280',
        line: '#E5E7EB',
        success: '#22B573',
        danger: '#E5534B',
      },
    },
  },
  plugins: [],
};
