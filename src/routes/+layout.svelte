<script lang="ts">
	import '../app.postcss';
	import Toast from '$lib/Toast.svelte'
	import Analytics from '$lib/Analytics.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
<Toast />
<Analytics />