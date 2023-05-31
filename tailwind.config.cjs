/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			screens: {
				xs: "360px",
				sm: "480px",
				"2xl": "1440px"
			},
		},
	},
	plugins: [],
}