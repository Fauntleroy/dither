<script lang="ts">
	import { cameras, webcamEnabled, mediaDeviceId, mediaStream } from '$/store.svelte';
	import { type ChangeEventHandler } from 'svelte/elements';
	import Select from './select.svelte';

	let videoElement: HTMLVideoElement | null = $state(null);
	const currentCameraDeviceId = $derived.by(() => {
		if (!$cameras.length) {
			return null;
		}
		const currentCamera = $cameras.find(({ deviceId }) => {
			return deviceId === $mediaDeviceId;
		});
		return currentCamera ? currentCamera.deviceId : $cameras[0].deviceId;
	});

	$effect(() => {
		const { stream } = $mediaStream;

		if (!stream) {
			console.error('No stream available to attach to <video> element.');
			return;
		}

		if (!videoElement) {
			console.error('No <video> element to attach stream to.');
			return;
		}

		videoElement.srcObject = null;
		videoElement.srcObject = stream;
		videoElement.play();

		return function onUnMount() {
			videoElement?.pause();
		};
	});

	function handleCameraAccessClick() {
		$webcamEnabled = true;
	}

	function handleDeviceIdChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		$mediaDeviceId = selectElement.value;
	}
</script>

{#if !$webcamEnabled}
	<button onclick={handleCameraAccessClick}>Grant Camera Access</button>
{:else}
	<select value={null} onchange={handleDeviceIdChange}>
		{#each $cameras as device, index}
			<option value={device.deviceId}>
				{device.label || `Camera ${index + 1}`}
			</option>
		{/each}
	</select>

	{#if mediaDeviceId !== null}
		<video autoplay muted playsinline bind:this={videoElement}></video>
	{/if}
{/if}
