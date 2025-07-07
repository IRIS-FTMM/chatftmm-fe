export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}" // Hanya periksa file .js dan .jsx
  ],
  theme: {
    extend: {
      colors: {
        'ftmm': {
          'prussian': '#073763',
          'pompadour': '#741B47',
          'silver': '#C0C0C0',
          'red': '#CC3366',
          'green': '#238891',
        }
      },
      backgroundImage: {
        'ftmm-gradient': 'linear-gradient(135deg, #CC3366 0%, #238891 100%)',
      }
    },
  },
  plugins: [],
};