<script lang="ts">
	import { onMount } from 'svelte';
	import Dither from 'canvas-dither';

	import { generateGIF } from '$/utils/filmstrip.js';
	import { convertImageData } from '$/utils/canvas.js';
	import { colorPalette } from '$/store.svelte.js';

	interface Props {
		fileName: string;
		src: string;
	}

	const FRAME_WIDTH = 200;
	const FRAME_HEIGHT = 150;

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
		startTime = performance.now();
		updateTime();
	});

	$effect(() => {
		if (!canvasContext) {
			console.error('Could not create 2d canvas context while loading image.');
			return;
		}

		const frameNumber = frame % 20;

		// if image hasn't loaded, show empty noise
		if (!(image instanceof Image)) {
			const imageData = canvasContext.createImageData(FRAME_WIDTH, FRAME_HEIGHT);
			const data = imageData.data;

			for (let i = 0; i < data.length; i += 4) {
				const grayValue = 128 + Math.random() * 10 - 5; // Base gray with slight variation
				data[i] = grayValue; // Red
				data[i + 1] = grayValue; // Green
				data[i + 2] = grayValue; // Blue
				data[i + 3] = 255; // Alpha (fully opaque)
			}

			canvasContext.putImageData(imageData, 0, 0);
			const canvasImageData = canvasContext.getImageData(0, 0, 200, 150);
			const filteredImageData = Dither.atkinson(canvasImageData);
			canvasContext.putImageData(filteredImageData, 0, 0);
			convertImageData(canvasElement, $colorPalette as unknown as [string, string]);
			return;
		}

		canvasContext.drawImage(
			image,
			// source
			0,
			frameNumber * FRAME_HEIGHT,
			FRAME_WIDTH,
			FRAME_HEIGHT,
			// destination
			0,
			0,
			FRAME_WIDTH,
			FRAME_HEIGHT
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
	<canvas class="canvas" width={FRAME_WIDTH} height={FRAME_HEIGHT} bind:this={canvasElement}
	></canvas>
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
