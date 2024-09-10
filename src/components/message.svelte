<script lang="ts">
	import type { default as FilmstripT } from '$/components/filmstrip.svelte';
	import { expoOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

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
	<div class="image" in:scale={{ duration: 1000, easing: expoOut, opacity: 0 }}>
		{#if Filmstrip}<Filmstrip src={imageUrl} fileName={messageText} />{/if}
	</div>
	<div
		class="text"
		in:scale={{ delay: 500, duration: 500, easing: expoOut, opacity: 0, start: 0.25 }}
	>
		{messageText}
	</div>
</div>

<style>
	.message {
		display: flex;
		align-items: center;
		margin-bottom: 25px;
	}

	.image {
		flex-shrink: 0;
		width: 300px;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: var(--white);
		border: var(--white) 1px solid;
		border-radius: 5px;
		transform-origin: 25% -50%;
	}

	@media (max-width: 600px) {
		.image {
			width: 200px;
			height: 150px;
		}
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
		transform-origin: 50% 50%;
	}
</style>
