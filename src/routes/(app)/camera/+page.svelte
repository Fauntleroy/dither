<script>
	import StylizedWebcamFeed from '$/components/stylized-webcam-feed.svelte';

	function handleMount() {
		console.log('mounted', arguments);
	}
</script>

<div><StylizedWebcamFeed onMount={handleMount} /></div>
