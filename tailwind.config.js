import flowbite from "flowbite-react/tailwind";


/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
      '7xl': '72px',
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '2px',
      1: '4px',
      1.5: '6px',
      2: '8px',
      2.5: '10px',
      3: '12px',
      3.5: '14px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      14: '56px',
      16: '64px',
      20: '80px',
      24: '96px',
      28: '112px',
      32: '128px',
      36: '144px',
      40: '160px',
      44: '176px',
      48: '192px',
      52: '208px',
      56: '224px',
      60: '240px',
      64: '256px',
      72: '288px',
      80: '320px',
      96: '384px',
    },
    extend: {
      colors: {
        'themeOrange' : '#d98e04',
        'themeTeal' : '#13A89D',
        'themeYellow' : '#D4DE23',
        'themeRed' : '#F42517',
        'themeGray' : '#EDF7FF',
        'themeDem' : '#EFEFEF',
      },
      gridTemplateColumns: {
        'fill': 'repeat(auto-fill, minmax(328px, 1fr))',
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scale(0.3)' },
          '100%': { transform: 'scale(1)'},
        },
        shrink: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.3)'},
        },
        flip: {
            '0%': { transform: 'scaleX(1)' },
            '25%': { transform: 'scaleX(0)' },
            '50%': { transform: 'scaleX(-1)' },
            '75%': { transform: 'scaleX(0)' },
            '100%': { transform: 'scaleX(1)' },
        }
      },
      animation: {
        flip: 'flip 3s ease-in-out infinite',
        grow: 'grow 0.2s ease-in-out',
        shrink: 'shrink 0.2s ease-out'
      },
    },
  },
  plugins: [
    flowbite.plugin()
  ],
}
