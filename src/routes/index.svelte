<script>
	import humanId from 'human-id';
	import { navigateTo } from 'svelte-router-spa';

	import { firestore, firestoreDb } from '../firebase.js';

	async function handleNewRoomClick () {
		try {
			const name = humanId(' ');
			const newRoom = await firestoreDb.collection('rooms').add({
				createdAt: firestore.FieldValue.serverTimestamp(),
				name
			});

			navigateTo(`rooms/${newRoom.id}`);
		} catch (error) {
			console.log('Error creating room!', error);
			alert('Error creating room!');
		}
	}
</script>

<style>

</style>

<svelte:head>
	<title>NOT Meatspac.es</title>
</svelte:head>

<h1>This is not Meatspac.es</h1>

<button on:click={handleNewRoomClick}>Create a New Room</button>