<script lang="ts">
	import { generateGIF } from '$/utils/filmstrip.js';
	import { convertImageData } from '$/utils/canvas.js';
	import { colorPalette } from '$/store.svelte.js';

	interface Props {
		fileName: string;
		src: string;
	}

	let { fileName, src }: Props = $props();
	let canvasElement: HTMLCanvasElement;

	async function loadImageAndDrawOnCanvas(
		imageUrl: string,
		targetCanvasElement: HTMLCanvasElement
	) {
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const img = new Image();
			img.src = URL.createObjectURL(blob);

			img.onload = () => {
				const ctx = targetCanvasElement.getContext('2d');

				if (!ctx) {
					console.error('Could not create 2d canvas context while loading image.');
					return;
				}

				// Adjust canvas size to match the image
				targetCanvasElement.width = img.width;
				targetCanvasElement.height = img.height;

				ctx.drawImage(img, 0, 0); // Draw the image onto the canvas

				convertImageData(targetCanvasElement, $colorPalette as unknown as [string, string]);
			};
		} catch (error) {
			console.error('Error loading or drawing image:', error);
		}
	}

	$effect(() => {
		loadImageAndDrawOnCanvas(src, canvasElement);
	});

	$effect(() => {
		convertImageData(canvasElement, $colorPalette as unknown as [string, string]);
	});

	function handleDownloadClick() {
		generateGIF(canvasElement, fileName);
	}
</script>

<div class="filmstrip">
	<canvas class="canvas" width="200" height="3000" bind:this={canvasElement}></canvas>
	<button class="download" type="button" onclick={handleDownloadClick}>Save ▿</button>
</div>

<style>
	@keyframes play-frames {
		from {
			transform: translateY(0%);
		}
		to {
			transform: translateY(-100%);
		}
	}

	.filmstrip {
		position: relative;
		width: 100%;
		max-width: 100%;
		aspect-ratio: 4 / 3;
	}

	.canvas {
		animation: play-frames 2000ms steps(20, end) infinite;
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
