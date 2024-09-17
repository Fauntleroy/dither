<script lang="ts">
	import StylizedWebcamFeed from '$/components/stylized-webcam-feed.svelte';
	import Select from '$/components/select.svelte';
	import Button from '$/components/button.svelte';

	import { colorPalette, cameraResolutionId, webcamEnabled } from '$/store.svelte';
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

	function handleEnableWebcamClick() {
		$webcamEnabled = true;
	}
</script>

<div class="cameraPage">
	<div class="cameraFeed">
		<svg class="line" viewBox="0 0 1 1" preserveAspectRatio="none">
			<line
				x1="0"
				y1="0"
				x2="1"
				y2="1"
				stroke="currentColor"
				stroke-width="0.001"
				stroke-dasharray="0.0025, 0.0025"
			/>
		</svg>
		<svg class="line" viewBox="0 0 1 1" preserveAspectRatio="none">
			<line
				x1="1"
				y1="0"
				x2="0"
				y2="1"
				stroke="currentColor"
				stroke-width="0.001"
				stroke-dasharray="0.0025, 0.0025"
			/>
		</svg>
		<div class="sizes">
			{#each Object.keys(CAMERA_RESOLUTIONS) as cameraResolutionId}
				{@const cameraResolution = CAMERA_RESOLUTIONS[cameraResolutionId]}
				<div
					class="size"
					style={`width: ${cameraResolution[0]}px; height: ${cameraResolution[1]}px`}
				>
					{cameraResolutionId}
				</div>
			{/each}
		</div>
		<div class="cameraFeedActual">
			<StylizedWebcamFeed {width} {height} onMount={handleMount} bind:recordingCanvasElement />
		</div>
		{#if !$webcamEnabled}
			<div class="enableWebcam">
				<Button onclick={handleEnableWebcamClick}>
					<em>Click</em> to enable your webcam<em>!</em>
				</Button>
			</div>
		{/if}
	</div>
	<div class="controls">
		<Select
			name="resolution"
			placeholder="Select a Resolution"
			options={resolutionOptions}
			onSelectedChange={handleResolutionChange}
			selected={{ value: $cameraResolutionId, label: $cameraResolutionId }}
		/>
		<Button onclick={handleGenerateGifClick}>Generate Gif</Button>
	</div>
</div>

<style>
	.cameraPage {
		display: flex;
		flex-direction: column;
	}

	.cameraFeed {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: 'main';
		align-items: center;
		justify-items: center;
		aspect-ratio: 4/ 3;
		border-bottom: var(--white) 1px dotted;
	}

	.cameraFeedActual {
		grid-area: main;
	}

	.enableWebcam {
		grid-area: main;
	}

	.line {
		aspect-ratio: 4 / 3;
		grid-area: main;
	}

	.sizes {
		grid-area: main;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: 'main';
		align-items: center;
		justify-items: center;
		aspect-ratio: 4/ 3;
	}

	.size {
		grid-area: main;
		font-family: sans-serif;
		font-size: 8px;
		text-transform: uppercase;
		letter-spacing: 0.25em;
		border: var(--white) 1px dotted;
		padding: 0.25em 0.5em;
		display: flex;
		align-items: end;
		justify-content: start;

		&:last-child {
			border: none;
		}
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
