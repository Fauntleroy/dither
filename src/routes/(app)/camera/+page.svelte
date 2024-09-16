<script>
	import CameraSelector from '$/components/camera-selector.svelte';

	function handleMount() {
		console.log('mounted', arguments);
	}
</script>

<!-- <div><StylizedWebcamFeed onMount={handleMount} /></div> -->
<div>
	<CameraSelector />
</div>
