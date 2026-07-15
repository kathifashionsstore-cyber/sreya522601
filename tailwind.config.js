const withOpacity = (variable) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${variable}))` : `rgb(var(${variable}) / ${opacityValue})`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: withOpacity('--color-primary-rgb'),
        'primary-dark': withOpacity('--color-primary-dark-rgb'),
        'primary-light': withOpacity('--color-primary-light-rgb'),
        secondary: withOpacity('--color-secondary-rgb'),
        'secondary-light': withOpacity('--color-secondary-light-rgb'),
        surface: withOpacity('--color-surface-rgb'),
        border: withOpacity('--color-border-rgb'),
        'text-primary': withOpacity('--color-text-primary-rgb'),
        'text-secondary': withOpacity('--color-text-secondary-rgb'),
        'text-muted': withOpacity('--color-text-muted-rgb'),
        'accent-gold': withOpacity('--color-accent-gold-rgb'),
        'accent-sage': withOpacity('--color-accent-sage-rgb'),
        'accent-blush': withOpacity('--color-accent-blush-rgb'),
        brand: {
          teal: withOpacity('--color-primary-rgb'),
          blue: withOpacity('--color-primary-dark-rgb'),
          rose: withOpacity('--color-secondary-rgb'),
          blush: withOpacity('--color-secondary-light-rgb'),
          cream: withOpacity('--color-bg-alt-rgb'),
          navy: withOpacity('--color-text-primary-rgb'),
          ink: withOpacity('--color-bg-dark-rgb'),
          green: withOpacity('--color-success-rgb'),
          amber: withOpacity('--color-warning-rgb'),
        },
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        soft: 'var(--shadow-lg)',
        lift: 'var(--shadow-xl)',
      },
      fontFamily: {
        display: ['var(--font-heading)'],
        sans: ['var(--font-body)'],
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        24: 'var(--space-24)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
    },
  },
  plugins: [],
}
