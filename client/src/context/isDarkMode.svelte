<script context="module">
	// TODO: maybe just use store

	import { setContext } from 'svelte/types/runtime';

	let isDarkMode = false;

	export const key = 'is-dark-mode';

	setContext(key, isDarkMode);

	export const toggleDarkMode = () => {
		isDarkMode = !isDarkMode;
	};
</script>
