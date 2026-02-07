/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Per CLAUDE.md - exact discipline colors
        pm: {
          light: '#EFF6FF',
          DEFAULT: '#3B82F6',
          dark: '#1E40AF'
        },
        design: {
          light: '#F5F3FF',
          DEFAULT: '#8B5CF6',
          dark: '#5B21B6'
        },
        engineering: {
          light: '#ECFDF5',
          DEFAULT: '#10B981',
          dark: '#047857'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
