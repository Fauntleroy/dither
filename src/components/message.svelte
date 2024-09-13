<script lang="ts">
	import type { default as FilmstripT } from '$/components/filmstrip.svelte';

	import { expoOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import RenderIfVisible from './render-if-visible.svelte';

	let Filmstrip: any = $state(null);

	$effect(() => {
		import('$/components/filmstrip.svelte').then((module) => {
			// TODO // look into this typing again after svelte 5 releases for real
			Filmstrip = module.default as any as FilmstripT;
		});
	});

	type MessageSizeT = 'normal' | 'large';

	interface MessagePropsT {
		imageUrl: string;
		text?: string;
		index?: number;
		size: MessageSizeT;
		interactive?: boolean;
	}

	let { imageUrl, text, index = 0, size = 'normal', interactive = true }: MessagePropsT = $props();

	const displayText = text || '…';
</script>

<div class="message {size}">
	<div class="image" in:scale={{ duration: 1000, easing: expoOut, opacity: 0, delay: index * 50 }}>
		<RenderIfVisible>
			{#if Filmstrip}
				<Filmstrip src={imageUrl} fileName={displayText} saveable={interactive} />
			{/if}
		</RenderIfVisible>
	</div>
	<div
		class="text"
		in:scale={{ delay: index * 50 + 500, duration: 500, easing: expoOut, opacity: 0, start: 0.25 }}
	>
		{displayText}
	</div>
</div>

<style>
	.message {
		--image-width: 200px;
		display: flex;
		align-items: center;
	}

	.large {
		--image-width: 300px;
	}

	.image {
		--border-radius: 5px;
		flex-shrink: 0;
		width: var(--image-width);
		aspect-ratio: 4 / 3;
		background-color: var(--white);
		outline: var(--white) 1px solid;
		border-radius: var(--border-radius);
		transform-origin: 25% -50%;
	}

	@media (max-width: 600px) {
		.image {
			width: 200px;
			height: 150px;
		}
	}

	.text {
		position: relative;
		z-index: 2;
		flex-grow: 1;
		min-width: 20ch;
		margin-left: -10px;
		padding: 15px 20px;
		text-align: center;
		overflow-wrap: break-word;
		word-break: break-all;
		text-wrap: balance;
		background: var(--black);
		color: var(--white);
		border: var(--white) 1px solid;
		border-radius: 5px;
		transform-origin: 50% 50%;
		box-shadow: var(--black) 0 1px 0 2px;

		&::before,
		&::after {
			position: absolute;
			display: flex;
			justify-content: center;
			width: 1em;
			height: 1em;
			border-radius: 0.25em;
			background: var(--white);
			color: var(--black);
			box-shadow: var(--black) 0 1px 0 2px;
		}

		&::before {
			content: '“';
			top: 0;
			left: 0;
			transform: translate(-50%, 25%);
		}

		&::after {
			content: '”';
			right: 0;
			bottom: 0;
			transform: translate(50%, -25%);
		}
	}
</style>
