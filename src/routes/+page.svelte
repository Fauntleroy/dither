<script lang="ts">
	import store from 'store2';

	import { STORE_ROOM_HISTORY } from '../constants';

	const roomHistory = store.get(STORE_ROOM_HISTORY);
	const roomHistoryArray: any[] = [];

	function handleNewRoomClick() {
		console.log('create a new room!');
	}
</script>

<svelte:head>
	<title>Dither - Lofi GIF Chat</title>
</svelte:head>

<div class="index">
	<h1 class="heading"><em>DITHER</em><br />is a lo-fi GIF chat app.</h1>
	<p>
		Create a room, invite your friends, and have fun making lo-fi GIFs to relax and chat to. I mean,
		webcams aren't that great, so why not lean into it?
	</p>
	<button class="createNewRoom" on:click={handleNewRoomClick}>Create a New Room ⚇</button>

	<hr />

	<h2>Rooms You've Been In:</h2>
	{#each roomHistoryArray as { id, lastSeen, name }, i (id)}
		<li><a href="/rooms/{id}">{name || id}</a></li>
	{/each}

	<hr />

	<h3>Prior Art:</h3>
	<p>
		This app wouldn't have been possible without inspiration from <a
			href="https://obradinn.com/"
			target="_blank">Return of the Obra Dinn</a
		>
		and <a href="https://meatspac.es/" target="_blank">Meatspac.es</a>
	</p>
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
</style>
