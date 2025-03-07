/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#3a36e0",
            light: "#6f6afa",
            dark: "#2a269c"
          },
          secondary: {
            DEFAULT: "#ff6b6b",
            light: "#ff9e9e",
            dark: "#ff4949"
          }
        },
        fontFamily: {
          sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif']
        },
        boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }
      }
    },
    plugins: [],
  }