<script lang="ts">
	import Dither from 'canvas-dither';
	import throttle from 'just-throttle';

	import { cameras, colorPalette, mediaDeviceId, mediaStream } from '../store.svelte.js';
	import { convertImageDataToColorPalette } from '../utils/canvas.js';

	const TARGET_WIDTH = 200;
	const TARGET_HEIGHT = 150;
	const TARGET_ASPECT = TARGET_WIDTH / TARGET_HEIGHT;

	interface Props {
		onMount: Function;
	}

	const { onMount }: Props = $props();
	let videoElement: HTMLVideoElement;
	let recordingCanvasElement: HTMLCanvasElement;
	let displayCanvasElement: HTMLCanvasElement;
	let canvasWidth: number = TARGET_WIDTH;
	let canvasHeight: number = TARGET_HEIGHT;
	let processedImageDrawRequestId: number;

	let webcamVideoStatus = $state('initial');

	function getCrop() {
		const { videoWidth, videoHeight } = videoElement;
		const webcamVideoAspect = videoWidth / videoHeight;
		let width, height;

		if (webcamVideoAspect > TARGET_ASPECT) {
			height = videoHeight;
			width = height * TARGET_ASPECT;
		} else {
			width = videoWidth;
			height = width / TARGET_ASPECT;
		}

		const x = videoWidth / 2 - width / 2;
		const y = videoHeight / 2 - height / 2;

		return { x, y, width, height };
	}

	function drawProcessedImage() {
		const displayCanvas2dContext = displayCanvasElement.getContext('2d');
		const recordingCanvas2dContext = recordingCanvasElement.getContext('2d');

		if (!displayCanvas2dContext || !recordingCanvas2dContext) {
			console.error('Canvas contexts could not be initialized');
			return;
		}

		const { x, y, width, height } = getCrop();
		displayCanvas2dContext.drawImage(
			videoElement,
			x,
			y,
			width,
			height, // source (webcam)
			0,
			0,
			canvasWidth,
			canvasHeight // destination (canvas)
		);
		const canvasImageData = displayCanvas2dContext.getImageData(0, 0, canvasWidth, canvasHeight);
		const filteredImageData = Dither.atkinson(canvasImageData);
		recordingCanvas2dContext.putImageData(filteredImageData, 0, 0);
		const colorChangedImageData = convertImageDataToColorPalette(filteredImageData, $colorPalette);
		displayCanvas2dContext.putImageData(colorChangedImageData, 0, 0);
	}

	const throttledDrawProcessedImage = throttle(drawProcessedImage, 100, true);

	function tryToDraw() {
		throttledDrawProcessedImage();

		processedImageDrawRequestId = requestAnimationFrame(tryToDraw);
	}

	$effect(() => {
		onMount({
			recordingCanvasElement: recordingCanvasElement
		});
	});

	$effect(() => {
		const mediaStreamUnsubscribe = mediaStream.subscribe((mediaStreamValue) => {
			const { stream } = mediaStreamValue;
			console.log(mediaStreamValue);
			if (!stream) {
				return;
			}

			videoElement.srcObject = null;
			videoElement.srcObject = stream;
			videoElement.play();

			cancelAnimationFrame(processedImageDrawRequestId);
			processedImageDrawRequestId = requestAnimationFrame(tryToDraw);
		});

		return function onUnMount() {
			cancelAnimationFrame(processedImageDrawRequestId);
			mediaStreamUnsubscribe();
		};
	});

	const handleVideoPlaying = throttle(function () {
		// TODO see if this can be done without artificial delay
		setTimeout(() => (webcamVideoStatus = 'playing'), 250);
	}, 1000);

	function handleVideoSuspend() {
		webcamVideoStatus = 'suspended';
	}

	function handleVideoWaiting() {
		webcamVideoStatus = 'waiting';
	}

	function handleFeedClick() {
		if ($cameras.length <= 1) {
			return;
		}

		const activeCameraIndex = $mediaDeviceId
			? $cameras.findIndex((camera) => camera.deviceId === $mediaDeviceId)
			: 0;
		const nextCameraIndex = $cameras.length - 1 > activeCameraIndex ? activeCameraIndex + 1 : 0;
		const nextCameraDeviceId = $cameras[nextCameraIndex].deviceId;
		mediaDeviceId.set(nextCameraDeviceId);
	}
</script>

<button
	type="button"
	class="stylized-webcam-feed"
	class:playing={webcamVideoStatus === 'playing'}
	onclick={handleFeedClick}
>
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		class="raw-webcam sekrit"
		bind:this={videoElement}
		onplaying={handleVideoPlaying}
		onsuspend={handleVideoSuspend}
		onwaiting={handleVideoWaiting}
		playsinline={true}
	></video>
	<canvas
		class="recording-webcam sekrit"
		width={TARGET_WIDTH}
		height={TARGET_HEIGHT}
		bind:this={recordingCanvasElement}
	></canvas>
	<canvas
		class="display-webcam"
		width={TARGET_WIDTH}
		height={TARGET_HEIGHT}
		bind:this={displayCanvasElement}
	></canvas>
	{#if $cameras.length > 1}<span class="switch-camera-icon">⟲</span>{/if}
</button>

<style>
	.stylized-webcam-feed {
		--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

		all: unset;
		position: relative;
		cursor: pointer;
		clip-path: circle(0%);
		transition: clip-path 1000ms var(--ease-out-quint);
	}

	.stylized-webcam-feed.playing {
		clip-path: circle(100%);
	}

	.raw-webcam {
		max-width: 300px;
	}

	.display-webcam {
		display: block;
		width: 100%;
		height: 100%;
	}

	.display-webcam {
		background: var(--black);
	}

	.sekrit {
		position: fixed;
		z-index: 9999;
		top: -9999px;
		visibility: hidden;
	}

	.switch-camera-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		color: var(--white);
		font-size: 40px;
		filter: drop-shadow(-2px 2px 0 var(--black));
		transform: translateY(-50%) translateX(-50%) scale(0.75);
		opacity: 0;
		transition:
			transform 400ms,
			opacity 400ms;
	}

	.stylized-webcam-feed:hover .switch-camera-icon {
		opacity: 1;
		transform: translateY(-50%) translateX(-50%) scale(1);
		transition:
			transform 200ms,
			opacity 200ms;
	}
</style>
