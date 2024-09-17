<script lang="ts">
	import StylizedWebcamFeed from '$/components/stylized-webcam-feed.svelte';
	import Select from '$/components/select.svelte';
	import Button from '$/components/button.svelte';

	import { colorPalette, cameraResolutionId } from '$/store.svelte';
	import { downloadFile, generateGIF } from '$/utils/filmstrip';
	import { CAMERA_RESOLUTIONS, type CameraResolutionId } from '$/constants';

	let recordingCanvasElement: HTMLCanvasElement | undefined = $state();

	function generateShortId(length: number = 8): string {
		const timestamp = Date.now().toString(36); // Base36 timestamp for shorter representation
		const randomChars = Math.random().toString(36).substring(2, length); // Random characters

		return timestamp + randomChars;
	}

	interface ResolutionOptionT {
		value: string;
		label: string;
	}

	let resolutions = [];
	let resolutionOptions: ResolutionOptionT[] = [];
	Object.entries(CAMERA_RESOLUTIONS).forEach(([cameraResolutionId, cameraResolution]) => {
		console.log(cameraResolutionId, cameraResolution);
		resolutions.push(cameraResolution);
		resolutionOptions.push({
			value: cameraResolutionId,
			label: cameraResolutionId
		});
	});
	let selectedResolution = $derived(CAMERA_RESOLUTIONS[$cameraResolutionId]);
	let width = $derived(selectedResolution[0]);
	let height = $derived(selectedResolution[1]);

	function handleMount() {
		console.log('mounted', arguments);
		console.log('recordingCanvasElement', recordingCanvasElement);
	}

	function handleResolutionChange(event: any) {
		const newCameraResolutionId = event.value as CameraResolutionId;
		$cameraResolutionId = newCameraResolutionId;
	}

	async function handleGenerateGifClick() {
		if (!recordingCanvasElement) {
			console.error('No recording canvas element available to generate from');
			return;
		}
		const gifBlob = await generateGIF(
			recordingCanvasElement,
			'stream',
			$colorPalette as [string, string],
			width,
			height
		);

		if (!gifBlob) {
			console.error('Could not create GIF from webcam feed');
			return;
		}

		downloadFile(gifBlob, `dither-gif_${generateShortId()}`);
	}
</script>

<div class="cameraPage">
	<StylizedWebcamFeed {width} {height} onMount={handleMount} bind:recordingCanvasElement />
	<div class="controls">
		<Select
			name="resolution"
			placeholder="Select a Resolution"
			options={resolutionOptions}
			onSelectedChange={handleResolutionChange}
			selected={$cameraResolutionId}
		/>
		<Button onclick={handleGenerateGifClick}>Generate Gif</Button>
	</div>
</div>

<style>
	.cameraPage {
		display: flex;
		flex-direction: column;
	}

	.controls {
		display: flex;
		flex-direction: row;
		gap: 1.5em;
		align-items: center;
		justify-content: center;
		padding: 1em;
	}
</style>
