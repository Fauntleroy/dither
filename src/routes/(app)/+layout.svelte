<script>
	import Nav from '$/components/nav.svelte';
</script>

<Nav />

<main class="layout">
	<slot></slot>
</main>

<style>
	.layout {
		max-width: 640px;
		margin: 0 auto;
		padding: 1em 1em;
		border: var(--white) 1px dotted;
		border-radius: 0.25em;
	}
</style>
