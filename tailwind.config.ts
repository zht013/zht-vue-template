import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: 'selector',
  corePlugins: {
    preflight: true
  },
  theme: {
    fontFamily: {
      sans: ['var(--el-font-family)']
    },
    extend: {
      screens: {
        '3xl': '1600px' // Adds a new `3xl:` screen variant
      },
      zIndex: {
        '9999': '9999'
      },
      animation: {
        'scroll-progress': 'scroll-progress 3s linear'
      },
      keyframes: {
        'scroll-progress': {
          from: { transform: 'scaleX(0)', opacity: '1' },
          to: { transform: 'scaleX(1)', opacity: '1' }
        }
      }
    }
  }
} satisfies Config
