/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "hey-yellow": "#fde03c",
        "hey-yellow-dark": "#FDD90D",
        "hey-blue": "#5848a0",

        "hey-gray": "#8F8F8F",
        "hey-light-gray": "#A3A3A3",
        "hey-medium-gray": "#A3A3A3",
        "hey-dark-gray": "#707070",

        "hey-blue": "#007bce",
        "hey-light-blue": "#358fcc",

        "hey-crimson": "#E11439",
        "hey-light-crimson": "#EE2F52",
        "hey-dark-crimson": "#970C26",

        "notifications-light-blue": "#2ebfec",
        "active-pink": "#e91e63",
        "active-background": "#efefef",
      },
    },
    fontFamily: {
      "tha-font": ["ibm-plex-mono"],
    },
  },
  plugins: [],
};
