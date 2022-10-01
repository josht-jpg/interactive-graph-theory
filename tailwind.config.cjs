/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				node: 'gray 0 0 6px'
			}
		}
	},
	plugins: []
};
