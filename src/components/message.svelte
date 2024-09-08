<script lang="ts">
	import type { default as FilmstripT } from '$/components/filmstrip.svelte';

	let Filmstrip: any = $state(null);

	$effect(() => {
		import('$/components/filmstrip.svelte').then((module) => {
			// TODO // look into this typing again after svelte 5 releases for real
			Filmstrip = module.default as any as FilmstripT;
		});
	});

	let { imageUrl, text } = $props();
	const messageText = text || '…';
</script>

<div class="message">
	<div class="image">
		{#if Filmstrip}<Filmstrip src={imageUrl} fileName={messageText} />{/if}
	</div>
	<div class="text">{messageText}</div>
</div>

<style>
	.message {
		display: flex;
		align-items: center;
		margin-bottom: 25px;
	}

	.image {
		flex-shrink: 0;
	}

	.text {
		flex-grow: 1;
		margin-left: -10px;
		padding: 15px 20px;
		background: var(--black);
		color: var(--white);
		border: var(--white) 1px solid;
		border-radius: 5px;
		z-index: 2;
	}
</style>
