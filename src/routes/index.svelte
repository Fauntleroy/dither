<script>
	import { goto } from '@sapper/app';
	import { onMount } from 'svelte';

	let firestoreDb;

	onMount(async () => {
		firestoreDb = await import('../firebase.js').firestoreDb;
	});

	async function handleNewRoomClick () {
		const newRoom = await firestoreDb.collection('rooms').add({});

		goto(`rooms/${newRoom.id}`);
	}
</script>

<style>

</style>

<svelte:head>
	<title>NOT Meatspac.es</title>
</svelte:head>

<h1>This is not Meatspac.es</h1>

<button on:click={handleNewRoomClick}>Create a New Room</button>