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
	.index {
		padding: 15px 0;
	}

	.create-new-room {
		display: block;
		margin: 0 auto;
	}
</style>

<svelte:head>
	<title>Dither - Lofi GIF Chat</title>
</svelte:head>

<div class="index">
	<h1><em>DITHER</em> is a lo-fi GIF chat app.</h1>
	<p>Create a room, invite your friends, and have fun making lo-fi GIFs to relax and chat to. I mean, webcams aren't that great, so why not lean into it?</p>
	<button class="create-new-room" on:click={handleNewRoomClick}>Create a New Room</button>

	<hr />

	<h2>Rooms You've Been In:</h2>
	{#each roomHistoryArray as { id, lastSeen, name }, i (id)}
		<li><a href="/rooms/{id}">{name || id}</a></li>
	{/each}

	<hr />

	<h3>Prior Art:</h3>
	<p>This app wouldn't have been possible without inspiration from:</p>
	<ul>
		<li><a href="https://obradinn.com/" target="_blank">Return of the Obra Dinn</a></li>
		<li><a href="https://meatspac.es/" target="_blank">Meatspac.es</a></li>
	</ul>
</div>