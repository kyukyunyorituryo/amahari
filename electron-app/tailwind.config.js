export default {
  content: [
    "./index.html",
    "./renderer.js",
    "./**/*.html",
    "./**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
  'bg-blue-600',
  'bg-blue-700',
  'focus:ring-blue-300',
  'focus:ring-blue-400',
],
};
