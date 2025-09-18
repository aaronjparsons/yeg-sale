
import { join } from 'path';
import type { Config } from 'tailwindcss';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#4a5679",
					DEFAULT: "#242c46",
					dark: "#161a28",
				},
				purple: {
					light: "#A892C2",
					DEFAULT: "#7A5C9D",
					dark: "#563F70",
				},
				green: {
					light: "#8BAE94",
					DEFAULT: "#5C8D67",
					dark: "#40634A",
				},
				yellow: {
					light: "#E4D6A0",
					DEFAULT: "#D4B860",
					dark: "#9C8030",
				},
			},
		},
	},
	plugins: []
} satisfies Config;

export default config;
