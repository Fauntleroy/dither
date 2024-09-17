<script lang="ts">
	import StylizedWebcamFeed from '$/components/stylized-webcam-feed.svelte';
	import Select from '$/components/select.svelte';
	import Button from '$/components/button.svelte';

	import { colorPalette } from '$/store.svelte';
	import { downloadFile, generateGIF } from '$/utils/filmstrip';

	let recordingCanvasElement: HTMLCanvasElement | undefined = $state();

	function generateShortId(length: number = 8): string {
		const timestamp = Date.now().toString(36); // Base36 timestamp for shorter representation
		const randomChars = Math.random().toString(36).substring(2, length); // Random characters

		return timestamp + randomChars;
	}

	const resolutions = [
		[200, 150],
		[320, 240],
		[480, 360],
		[640, 480]
	];
	const resolutionOptions = resolutions.map((resolution, index) => {
		return {
			value: index,
			label: `${resolution[0]} x ${resolution[1]}`
		};
	});
	let selectedResolutionIndex = $state(0);
	let width = $derived(resolutions[selectedResolutionIndex][0]);
	let height = $derived(resolutions[selectedResolutionIndex][1]);

	function handleMount() {
		console.log('mounted', arguments);
		console.log('recordingCanvasElement', recordingCanvasElement);
	}

	function handleResolutionChange(event: any) {
		const resolutionIndex = Number(event.value as string);
		selectedResolutionIndex = resolutionIndex;
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
			selected={selectedResolutionIndex}
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
