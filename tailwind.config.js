/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Glavna HTML datoteka
    "./src/**/*.{js,ts,jsx,tsx,vue}", // Sve JS, TS, JSX, TSX, Vue datoteke unutar src foldera i svih podfoldera
    // Dodajte ovdje sve ostale putanje gdje ćete koristiti Tailwind klase, npr.
    // "./public/**/*.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
