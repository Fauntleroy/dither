<script>
	import { Route } from 'svelte-router-spa';

	import Nav from '../components/nav.svelte';

	export let currentRoute;
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
	<Route {currentRoute} />
</main>