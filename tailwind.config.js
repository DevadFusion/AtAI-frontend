/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#2ECC71",
          secondary: "#27AE60",
          background: "#ECF0F1",
        },
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
        },
      },
    },
    plugins: [],
  };