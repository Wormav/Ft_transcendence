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
			fontSize: {
				'base': 'var(--font-size, 22px)',
				'xs': 'calc(var(--font-size, 22px) * 0.75)',
				'sm': 'calc(var(--font-size, 22px) * 0.875)',
				'lg': 'calc(var(--font-size, 22px) * 1.125)',
				'xl': 'calc(var(--font-size, 22px) * 1.25)',
				'2xl': 'calc(var(--font-size, 22px) * 1.5)',
				'3xl': 'calc(var(--font-size, 22px) * 1.875)',
				'4xl': 'calc(var(--font-size, 22px) * 2.25)',
			},
		},
	},
	plugins: [],
};
