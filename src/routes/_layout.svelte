<script>
	import Nav from '../components/nav.svelte';
</script>

<style>
	@media (prefers-color-scheme: dark) {
		:global(body) {
			background: #1a1a1a;
			color: #eee;
		}
	}
</style>

<Nav />

<main>
	<slot></slot>
</main>