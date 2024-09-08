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
		padding: 25px 10px 20px 10px;
	}
</style>
