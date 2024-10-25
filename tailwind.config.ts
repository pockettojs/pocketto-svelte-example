import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        success: '#179C5F',
        error: '#FF3B30',
        info: '#007AFF',
        warning: '#FF9500',
        svelte: {
          50: '#FDE4D1',
          100: '#FBC6A4',
          200: '#F89A77',
          300: '#F76E4B',
          400: '#F4502F',
          500: '#E75027',
          600: '#C84424',
          700: '#A83A21',
          800: '#8B2F1D',
          900: '#6F251A'
        },
      },
    },
  },

  plugins: []
} as Config;
