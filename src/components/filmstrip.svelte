<script lang="ts">
	import { generateGIF } from '$/utils/filmstrip.js';
	import { convertImageDataToColorPalette } from '$/utils/canvas.js';
	import { colorPalette } from '$/store.svelte.js';

	interface Props {
		src: string;
	}

	let { src }: Props = $props();
	let canvasElement: HTMLCanvasElement;

	$effect(() => {
		drawDataURIOnCanvas(src);

		const colorPaletteUnsubscribe = colorPalette.subscribe(() => drawDataURIOnCanvas(src));

		return () => {
			colorPaletteUnsubscribe();
		};
	});

	function drawDataURIOnCanvas(strDataURI: string) {
		const tempImage = new Image();

		function drawDataFromImage() {
			const canvasContext = canvasElement.getContext('2d');

			if (!canvasContext) {
				console.error('Error getting canvas context!');
				return;
			}

			canvasContext.drawImage(tempImage, 0, 0);
			const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
			const convertedImageData = convertImageDataToColorPalette(imageData, $colorPalette);
			canvasContext.putImageData(convertedImageData, 0, 0);
		}

		tempImage.addEventListener('load', drawDataFromImage);
		tempImage.setAttribute('src', strDataURI);
	}

	function handleDownloadClick() {
		console.log('handleDownloadClick()');
		generateGIF(canvasElement);
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
		width: 300px;
		height: 225px;
		max-width: 100%;
		overflow: hidden;
		background: var(--black);
		border: var(--white) 1px solid;
		border-radius: 5px;
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

	@media (max-width: 600px) {
		.filmstrip {
			width: 200px;
			height: 150px;
		}
	}
</style>
