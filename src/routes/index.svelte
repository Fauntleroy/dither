<script>
	import humanId from 'human-id';
	import { navigateTo } from 'svelte-router-spa';
	import store from 'store2';

	import { firestore, firestoreDb } from '../firebase.js';

	import { STORE_ROOM_HISTORY } from '../constants.js';

	const roomHistory = store.get(STORE_ROOM_HISTORY);
	const roomHistoryArray = [];
	for (const roomId in roomHistory) {
		roomHistoryArray.push({
			id: roomId,
			...roomHistory[roomId]
		});
	}
	roomHistoryArray.sort((a, b) => {
		if (a.lastSeen > b.lastSeen) {
			return -1;
		};

		return 1;
	});

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

<h2>Rooms You've Been In</h2>
{#each roomHistoryArray as { id, lastSeen, name }, i (id)}
	<li><a href="/rooms/{id}">{name || id}</a></li>
{/each}