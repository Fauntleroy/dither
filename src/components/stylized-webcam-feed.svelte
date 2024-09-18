<script lang="ts">
	import Dither from 'canvas-dither';
	import throttle from 'just-throttle';

	import { cameras, colorPalette, mediaDeviceId, mediaStream } from '$/store.svelte.js';
	import { convertImageData } from '$/utils/canvas.js';

	const TARGET_WIDTH = 200;
	const TARGET_HEIGHT = 150;
	const TARGET_ASPECT = TARGET_WIDTH / TARGET_HEIGHT;

	interface Props {
		onMount: Function;
		width: number;
		height: number;
		recordingCanvasElement: HTMLCanvasElement | undefined;
	}

	let {
		onMount,
		width = TARGET_WIDTH,
		height = TARGET_HEIGHT,
		recordingCanvasElement = $bindable()
	}: Props = $props();
	let videoElement: HTMLVideoElement | undefined;
	// let recordingCanvasElement: HTMLCanvasElement;
	let displayCanvasElement: HTMLCanvasElement | undefined;
	let processedImageDrawRequestId: number;

	let webcamVideoStatus = $state('initial');

	function getCrop(videoElementToCrop: HTMLVideoElement) {
		const { videoWidth, videoHeight } = videoElementToCrop;
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
		if (!displayCanvasElement) {
			console.error('No canvas element to draw to');
			return;
		}

		if (!recordingCanvasElement) {
			console.error('No canvas element to draw from');
			return;
		}

		const displayCanvas2dContext = displayCanvasElement.getContext('2d');
		const recordingCanvas2dContext = recordingCanvasElement.getContext('2d', {
			willReadFrequently: true
		});

		if (!displayCanvas2dContext || !recordingCanvas2dContext) {
			console.error('Canvas contexts could not be initialized');
			return;
		}

		if (!videoElement) {
			console.error('No video element to draw from');
			return;
		}

		const { x, y, width: cropWidth, height: cropHeight } = getCrop(videoElement);
		displayCanvas2dContext.drawImage(
			videoElement,
			x,
			y,
			cropWidth,
			cropHeight, // source (webcam)
			0,
			0,
			width,
			height // destination (canvas)
		);
		const canvasImageData = displayCanvas2dContext.getImageData(0, 0, width, height);
		const filteredImageData = Dither.atkinson(canvasImageData);
		recordingCanvas2dContext.putImageData(filteredImageData, 0, 0);
		displayCanvas2dContext.putImageData(filteredImageData, 0, 0);
		convertImageData(displayCanvasElement, $colorPalette as unknown as [string, string]);
	}

	const throttledDrawProcessedImage = throttle(drawProcessedImage, 100, { leading: true });

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
		const { stream } = $mediaStream;

		if (!stream) {
			console.warn('No stream available to attach to video element');
			return;
		}

		if (!videoElement) {
			console.warn('No video element available to attach stream to');
			return;
		}

		videoElement.srcObject = null;
		videoElement.srcObject = stream;
		videoElement.play();

		cancelAnimationFrame(processedImageDrawRequestId);
		processedImageDrawRequestId = requestAnimationFrame(tryToDraw);

		return function onUnMount() {
			cancelAnimationFrame(processedImageDrawRequestId);
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
	<canvas class="recording-webcam sekrit" {width} {height} bind:this={recordingCanvasElement}
	></canvas>
	<canvas
		class="display-webcam"
		{width}
		{height}
		bind:this={displayCanvasElement}
		style={`width: ${width}px;`}
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
		display: block;
	}

	.stylized-webcam-feed.playing {
		clip-path: circle(100%);
	}

	.raw-webcam {
	}

	.display-webcam {
		display: block;
	}

	.display-webcam {
		background: var(--black);
		transition: all 500ms cubic-bezier(0.16, 1, 0.3, 1);
		max-width: 100%;
	}

	.sekrit {
		position: fixed;
		z-index: 9999;
		top: -9999px;
		visibility: hidden;
		display: none;
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
