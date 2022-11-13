// tailwind.config.js
module.exports = {
    purge: [],
    darkMode: false,
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [
      require("tailwindcss"), require("autoprefixer")
    ]
  }