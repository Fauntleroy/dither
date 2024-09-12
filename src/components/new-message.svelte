<script lang="ts">
	import { mediaStream, webcamEnabled } from '$/store.svelte.js';
	import { generateImage } from '$/utils/filmstrip.js';

	import StylizedWebcamFeed from '$/components/stylized-webcam-feed.svelte';
	import Button from './button.svelte';

	interface Props {
		onCreateMessage: Function;
	}

	let { onCreateMessage }: Props = $props();

	let recordingCanvasElement: HTMLCanvasElement;
	let inputMessage: string = $state('');
	let recording: boolean = $state(false);

	interface onMountDataT {
		recordingCanvasElement: HTMLCanvasElement;
	}

	function onMount(mountData: onMountDataT) {
		recordingCanvasElement = mountData.recordingCanvasElement;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		recording = true;
		const imageDataBlob = await generateImage(recordingCanvasElement);
		recording = false;

		onCreateMessage({
			text: inputMessage,
			imageDataBlob
		});

		inputMessage = '';
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			handleSubmit(event);
		}
	}

	function handleEnableWebcamClick() {
		$webcamEnabled = true;
	}
</script>

<div class="new-message" class:recording>
	<form class="form" onsubmit={handleSubmit}>
		<div class="recording-booth">
			<StylizedWebcamFeed {onMount} />
			{#if recording}<span class="recording-indicator"></span>{/if}
			<div class="recording-progress"></div>
		</div>
		<div class="fake-input">
			<textarea
				class="input"
				bind:value={inputMessage}
				onkeydown={handleInputKeydown}
				placeholder="Press enter to record a clip and send a message"
				disabled={!$mediaStream || recording || !$webcamEnabled}
			></textarea>
			<span class="fake-input__action">
				<Button type="submit" disabled={!$mediaStream || recording || !$webcamEnabled}>⇓</Button>
			</span>
		</div>
	</form>
	{#if !$webcamEnabled}
		<div class="enable-webcam-message__container">
			<Button onclick={handleEnableWebcamClick}>
				<em>Click</em> to enable your webcam and chat<em>!</em>
			</Button>
		</div>
	{/if}
</div>

<style>
	@keyframes indicatorGlow {
		from {
			background: rgba(255, 0, 0, 0.5);
		}
		to {
			background: red;
		}
	}

	.new-message {
		position: relative;
		max-width: 540px;
		margin: 0 auto;
		border-radius: 0.25em;
		padding: 1px;
		background: var(--white);
		overflow: hidden;
	}

	.form {
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 1px;
		margin: 0;
	}

	.fake-input {
		display: flex;
		flex-grow: 1;
		position: relative;
		background: none;
		color: var(--black);
		overflow: hidden;
		transition: transform 200ms;
		border: transparent 1px solid;
		border-radius: 0.25em;
	}

	.fake-input:focus-within {
		border-color: var(--black);
	}

	.input {
		display: block;
		border: none;
		margin: 0;
		padding: 10px 50px 10px 15px;
		font-size: inherit;
		font-style: italic;
		width: 100%;
		resize: none;
	}

	.input:focus {
		outline: none;
	}

	.fake-input__action {
		position: absolute;
		top: 50%;
		right: 10px;
		transform: translateY(-50%);
	}

	.recording-booth {
		position: relative;
		flex-shrink: 0;
		width: 150px;
		height: 113px;
		overflow: hidden;
		border-radius: calc(0.25em - 1px);
	}

	.recording-indicator {
		position: absolute;
		bottom: 10px;
		left: 10px;
		display: block;
		border-radius: 50%;
		background: red;
		width: 10px;
		height: 10px;
		animation: indicatorGlow 500ms linear alternate infinite;
	}

	.recording-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 3px;
		background: var(--white);
		transition: width 200ms;
	}

	.new-message.recording .recording-progress {
		width: 100%;
		transition: width 2000ms linear;
	}

	.enable-webcam-message__container {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 480px) {
		.recording-booth {
			width: 100px;
			height: 75px;
		}
	}
</style>
