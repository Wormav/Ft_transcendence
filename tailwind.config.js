/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				default: ['Open Sans', 'sans-serif'],
			},
			colors: {
				primary: '#00babc',
				background: '#f3f4f6',
				white: '#fbfbfd',
				gray: '#b8b8ba',
				red: '#ff0000',
			},
		},
	},
	plugins: [],
};
