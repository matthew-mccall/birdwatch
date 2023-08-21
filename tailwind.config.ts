import { type Config } from 'tailwindcss'

export default {
  content: ['node_modules/daisyui/dist/**/*.js', 'node_modules/react-daisyui/dist/**/*.js', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [{
      light: {
        ...require('daisyui/src/theming/themes')['[data-theme=light]'], /* eslint-disable-line @typescript-eslint/no-var-requires */
        'base-100': '#e6e6ef',
        'base-200': '#f1f1f6',
        'base-300': '#dadbe6',
        primary: '#ffb300'
      },
      dark: {
        ...require('daisyui/src/theming/themes')['[data-theme=dark]'], /* eslint-disable-line @typescript-eslint/no-var-requires */
        'base-100': '#282829',
        'base-200': '#1e1e1f',
        'base-300': '#232325',
        primary: '#ffb300'
      }
    }]
  }
} satisfies Config
