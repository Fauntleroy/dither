<script>
	import { goto } from '@sapper/app';

	function handleNewRoomClick () {
		const roomId = 1;

		goto(`rooms/${roomId}`);
	}
</script>

<style>
</style>

<svelte:head>
	<title>NOT Meatspac.es</title>
</svelte:head>

<h1>This is not Meatspac.es</h1>

<button on:click={handleNewRoomClick}>Create a New Room</button>