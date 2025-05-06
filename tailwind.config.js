/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
	  extend: {
		  colors: {
			  primary: {
				DEFAULT: "#00BABC"
			  },
			  background: {
				DEFAULT: "#F3F4F6"
			  },
			  white: {
				DEFAULT: "#FBFBFD"
			  },
			  gray: {
				DEFAULT: "#B8B8BA"
			  },
			  red: {
				DEFAULT: "#FF0000"
			  },
		  },
		  fontFamily: {
			sans: ['Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
		  },
	},
  },
  plugins: [],
}
