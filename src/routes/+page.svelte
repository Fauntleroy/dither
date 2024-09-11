<script lang="ts">
	import store from 'store2';
	import humanId from 'human-id';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	import { firestore } from '$/firebase';

	import { STORE_ROOM_HISTORY } from '$/constants';

	interface RoomHistoryEntryT {
		lastSeen: number;
		name: string;
	}
	interface RoomHistoryT {
		[key: string]: RoomHistoryEntryT;
	}
	type RoomHistoryEntriesT = [string, RoomHistoryEntryT];
	interface RoomHistoryArrayEntryT extends RoomHistoryEntryT {
		id: string;
	}

	const roomHistory: RoomHistoryT = store.get(STORE_ROOM_HISTORY) || {};
	const roomHistoryArray: RoomHistoryArrayEntryT[] = Object.entries(roomHistory).map(
		([id, { lastSeen, name }]: RoomHistoryEntriesT) => {
			return { id, lastSeen, name };
		}
	);

	const roomsRef = collection(firestore, 'rooms');

	async function handleNewRoomClick() {
		const newRoomDoc = await addDoc(roomsRef, {
			name: humanId(' '),
			createdAt: serverTimestamp()
		});

		goto(`/rooms/${newRoomDoc.id}`);
	}
</script>

<svelte:head>
	<title>Dither - Lofi GIF Chat</title>
</svelte:head>

<div class="index">
	<h1 class="heading"><em>DITHER</em><br />is a lo-fi GIF chat app.</h1>
	<p>
		Create a room, invite your friends, and have fun lobbing aggressively dithered Game Boy
		Camera-esque animations of yourselves to each other!
	</p>
	<button class="createNewRoom" on:click={handleNewRoomClick}>Create a New Room ⚇</button>

	<hr />

	<h2 class="room-list-heading">Rooms You've Visited</h2>
	<ul class="room-list">
		{#each roomHistoryArray as { id, lastSeen, name }, i (id)}
			<li><a href="/rooms/{id}">{name || id}</a></li>
		{/each}
	</ul>

	<hr />

	<div>
		<h3>Prior Art:</h3>
		<p>
			This app wouldn't have been possible without inspiration from <a
				href="https://obradinn.com/"
				target="_blank">Return of the Obra Dinn</a
			>
			and <a href="https://meatspac.es/" target="_blank">Meatspac.es</a>
		</p>
	</div>
</div>

<style>
	.index {
		display: flex;
		flex-direction: column;

		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p {
			margin: 0;
		}
	}

	.heading {
		text-align: center;
	}

	.createNewRoom {
		align-self: center;
	}

	.room-list-heading {
		align-self: center;
	}

	.room-list {
		align-self: center;
	}
</style>
