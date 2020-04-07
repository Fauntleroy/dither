<script>
	import { navigateTo } from 'svelte-router-spa';

	import { firestoreDb } from '../firebase.js';

	async function handleNewRoomClick () {
		const newRoom = await firestoreDb.collection('rooms').add({});

		navigateTo(`rooms/${newRoom.id}`);
	}
</script>

<style>

</style>

<svelte:head>
	<title>NOT Meatspac.es</title>
</svelte:head>

<h1>This is not Meatspac.es</h1>

<button on:click={handleNewRoomClick}>Create a New Room</button>