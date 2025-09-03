
import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {
			colors: {
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
	plugins: [
		// 4. Append the Skeleton plugin (after other plugins)
		skeleton({
			themes: { preset: [ "skeleton" ] }
		})
	]
} satisfies Config;

export default config;
