<script lang="ts">
	import Select from './select.svelte';

	import { cameraResolutionId } from '$/store.svelte';

	import { CAMERA_RESOLUTIONS, type CameraResolutionId } from '$/constants';

	interface ResolutionOptionT {
		value: string;
		label: string;
		id: CameraResolutionId;
	}

	const { ...restProps } = $props();

	let resolutions = [];
	let resolutionOptions: ResolutionOptionT[] = [];
	Object.entries(CAMERA_RESOLUTIONS).forEach(([cameraResolutionId, cameraResolution]) => {
		resolutions.push(cameraResolution);
		resolutionOptions.push({
			id: cameraResolutionId as CameraResolutionId,
			value: cameraResolutionId,
			label: cameraResolutionId
		});
	});

	function handleSelectedChange(event: any) {
		const newCameraResolutionId = event.value as CameraResolutionId;
		$cameraResolutionId = newCameraResolutionId;
	}
</script>

<Select
	name="resolution"
	placeholder="Select a Resolution"
	options={resolutionOptions}
	onSelectedChange={handleSelectedChange}
	selected={{ value: $cameraResolutionId, label: $cameraResolutionId }}
	{...restProps}
/>
