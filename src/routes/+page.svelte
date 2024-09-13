<script lang="ts">
	import store from 'store2';
	import humanId from 'human-id';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	import { firestore } from '$/firebase';

	import { STORE_ROOM_HISTORY } from '$/constants';

	import Button from '$/components/button.svelte';
	import Message from '$/components/message.svelte';

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
	<div>
		Create a room, invite your friends, and have fun lobbing <em>dithered</em> Game Boy Camera-esque
		animations of yourselves to each other!
	</div>
	<div class="demoMessage">
		<Message imageUrl="/home-promo-filmstrip.png" text="Howdy!" size="normal" interactive={false} />
	</div>
	<div class="createNewRoom">
		<Button onclick={handleNewRoomClick}>Create a GIF Chat Room ➔</Button>
	</div>

	<hr />

	<div class="rooms">
		<h2 class="room-list-heading">Rooms You've Visited</h2>
		<ul class="room-list">
			{#each roomHistoryArray as { id, lastSeen, name }, i (id)}
				<li><a href="/rooms/{id}">{name || id}</a></li>
			{/each}
		</ul>
	</div>

	<hr />

	<div>
		<h3>Prior Art:</h3>
		<div>
			This app wouldn't have been possible without inspiration from <a
				href="https://obradinn.com/"
				target="_blank">Return of the Obra Dinn</a
			>
			and <a href="https://meatspac.es/" target="_blank">Meatspac.es</a>
		</div>
	</div>
</div>

<style>
	.index {
		display: flex;
		flex-direction: column;
		padding: 0.5em 0;
		gap: 1em;

		h1,
		h2,
		h3,
		ul {
			margin: 0;
		}
	}

	.heading {
		text-align: center;
	}

	.demoMessage {
		align-self: center;
	}

	.createNewRoom {
		align-self: center;
	}

	.rooms {
		display: flex;
		flex-direction: column;
		align-items: center;
		align-self: center;
		gap: 0.5em;
	}
</style>
