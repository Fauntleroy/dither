<script>
	import { Route } from 'svelte-router-spa';

	import Nav from '../components/nav.svelte';

	export let currentRoute;
</script>

<style>
	.layout {
		max-width: 640px;
		margin: 0 auto;
		padding: 25px 10px 20px 10px;
	}
</style>

<Nav />

<main class="layout">
	<Route {currentRoute} />
</main>