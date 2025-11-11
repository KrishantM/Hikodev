import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hiko-green': '#26443B',
        'hiko-cream': '#FCF5E5',
        'hiko-yellow': '#EFD249',
      },
      fontFamily: {
        'montserrat': ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        'source-sans': ['var(--font-source-sans)', 'Source Sans 3', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
