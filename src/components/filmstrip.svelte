<script lang="ts">
	import { onMount } from 'svelte';

	import { generateGIF } from '$/utils/filmstrip.js';
	import { convertImageData } from '$/utils/canvas.js';
	import { colorPalette } from '$/store.svelte.js';

	interface Props {
		fileName: string;
		src: string;
	}

	let { fileName, src }: Props = $props();
	let image: HTMLImageElement | undefined = $state();
	let startTime: number = $state(0);
	let currentTime: number = $state(0);
	let canvasElement: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D | null;
	let frame = $derived(Math.floor((currentTime - startTime) / 100));

	async function loadImage(imageUrl: string) {
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const img = new Image();
			img.src = URL.createObjectURL(blob);

			img.onload = () => {
				image = img;
				startTime = performance.now();
				updateTime();
			};
		} catch (error) {
			console.error('Error loading or drawing image:', error);
		}
	}

	function updateTime() {
		currentTime = performance.now();

		window.requestAnimationFrame(updateTime);
	}

	onMount(() => {
		canvasContext = canvasElement.getContext('2d');

		loadImage(src);
	});

	$effect(() => {
		if (!(image instanceof Image)) {
			return;
		}

		if (!canvasContext) {
			console.error('Could not create 2d canvas context while loading image.');
			return;
		}

		const frameNumber = frame % 20;

		canvasContext.drawImage(
			image,
			// source
			0,
			frameNumber * 150,
			200,
			150,
			// destination
			0,
			0,
			200,
			150
		); // Draw the image onto the canvas

		convertImageData(canvasElement, $colorPalette as unknown as [string, string]);
	});

	function handleDownloadClick() {
		if (!image) {
			return;
		}

		generateGIF(image, $colorPalette as unknown as [string, string], fileName);
	}
</script>

<div class="filmstrip">
	<canvas class="canvas" width="200" height="150" bind:this={canvasElement}></canvas>
	<button class="download" type="button" onclick={handleDownloadClick}>Save ▿</button>
</div>

<style>
	.filmstrip {
		position: relative;
		width: 100%;
		max-width: 100%;
		aspect-ratio: 4 / 3;
	}

	.canvas {
		width: 100%;
		image-rendering: crisp-edges;
		image-rendering: pixelated;
	}

	.download {
		opacity: 0;
		transition:
			opacity 200ms,
			transform 200ms;
		transform: scale(0.9);
		position: absolute;
		top: 5px;
		right: 5px;
		outline: var(--black) 2px solid;
	}

	.filmstrip:hover .download {
		opacity: 1;
		transform: scale(1);
	}
</style>
