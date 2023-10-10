import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        container: 'var(--neutral-10, #F9FAFC)',
        content: 'var(--neutral-00, #FFF)',
        primary: 'var(--primary-blue, #1870F0)'
      },
      colors: {
        primary: 'var(--primary-blue, #1870F0)',
        grey: 'var(--neutral-30, #6D7C88)',
      }
    },
  },
  plugins: [],
}
export default config
