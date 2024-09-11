<script>
	import Nav from '../components/nav.svelte';
</script>

<Nav />

<main class="layout">
	<slot></slot>
</main>

<style>
	.layout {
		max-width: 640px;
		margin: 0 auto;
		padding: 2.5em 1em;
	}
</style>
