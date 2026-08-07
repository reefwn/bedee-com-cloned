import type { Config } from 'tailwindcss'

// Palette + type scale transplanted verbatim from plans/03-replication-prompt.md §2 —
// same-brand migration, no color reassignment.
const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#081F7C', // Deep Blue
        secondary: '#317DF5', // BeDee Blue
        tertiary: '#455FA5', // Slate Blue
        accent: '#FF4C14', // Alert Coral
        ink: '#222222',
        muted: '#666666',
        'panel-1': '#F4F8FF',
        'panel-2': '#F4F7FC',
        'footer-bg': '#F0F0F0',
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
      borderRadius: {
        pill: '50px',
      },
      transitionTimingFunction: {
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)', // entrances/exits — starts fast, feels responsive
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)', // on-screen movement/morphing
      },
    },
  },
  plugins: [],
}

export default config
