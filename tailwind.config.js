// tailwind.config.js
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}", // Adjust paths as necessary
	],
	theme: {
		extend: {
			flex: {
				'2': '2 2 0%',
				'3': '3 3 0%',
				'4': '4 4 0%',
				'5': '5 5 0%'
			}
		},
	},
	plugins: [],
	safelist: [
		{
			pattern: /^(col-span|grid-cols)-\d+$/,
			pattern: /^(bg-)?(gray|blue|green|yellow|red)-\d{3}$/,
		},
	],
};
