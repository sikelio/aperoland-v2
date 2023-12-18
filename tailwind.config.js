/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./resources/**/*.{edge,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        appYellow: '#FC9D02',
        appYellowLight: '#FFB133',
        appOrange: '#F65C06',
        appOrangeLight: '#FF782D',
        appOrangeRed: '#E83213',
        appOrangeRedLight: '#E15239',
        appRed: '#DE1E23',
        appRedLight: '#E13136',
        appBlueDark: '#021B29',
        appBlueDarkLight: '#0C2C3E',
      },
    },
  },
  plugins: [],
};
