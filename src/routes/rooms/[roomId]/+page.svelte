<script lang="ts">
	import type { ChatMessageT, RoomT } from '$app';

	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import store from 'store2';

	import {
		addDoc,
		doc,
		collection,
		getFirestore,
		onSnapshot,
		query,
		orderBy,
		limit,
		serverTimestamp
	} from 'firebase/firestore';
	// import { pageVisible } from '../../../store.js';

	import { firebaseApp } from '../../../firebase.js';

	import Message from '$/components/message.svelte';

	import { STORE_ROOM_HISTORY } from '../../../constants.js';

	export let data;

	const firebaseDb = getFirestore(firebaseApp);
	const roomMessagesRef = collection(firebaseDb, `rooms/${data.roomId}/messages`);

	let unreadCount = 0;
	let textAreaElement: HTMLTextAreaElement | null;
	let roomNameInputValue = data.roomId;

	// firestore data
	let room: RoomT;
	let messages: ChatMessageT[] = [];

	$: roomName = room ? room.name : data.roomId;

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 100),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 125,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	function updateRoomHistory() {
		const roomHistory = store.get(STORE_ROOM_HISTORY);
		const updatedRoomHistory = {
			...roomHistory,
			[data.roomId]: {
				lastSeen: Date.now(),
				name: room.name
			}
		};

		store.set(STORE_ROOM_HISTORY, updatedRoomHistory);
	}

	let NewMessage;

	onMount(() => {
		(async function () {
			try {
				// import the NewMessage comonent
				const module = await import('$/components/new-message.svelte');
				NewMessage = module.default;
			} catch (importError) {
				console.error('Error importing NewMessage component', importError);
			}
		})();

		if (!data.roomId) {
			return;
		}

		// get room data
		const currentRoomRef = doc(firebaseDb, 'rooms', data.roomId);
		const roomUnsubscribe = onSnapshot(currentRoomRef, (roomSnapshot) => {
			if (roomSnapshot.exists()) {
				room = roomSnapshot.data();
				roomNameInputValue = room.name;
				updateRoomHistory();
			}
		});

		// get room messages
		const roomMessagesQuery = query(roomMessagesRef, limit(10), orderBy('createdAt', 'desc'));
		const roomMessagesUnsubscribe = onSnapshot(roomMessagesQuery, (roomMessagesSnapshot) => {
			messages = roomMessagesSnapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data()
				};
			});
		});

		return () => {
			roomUnsubscribe();
			roomMessagesUnsubscribe();
		};
	});

	// pageVisible.subscribe(() => {
	// 	unreadCount = 0;
	// });

	interface HandleCreateMessageArgs {
		text: string;
		imageDataURL: string;
	}

	async function handleCreateMessage({ text, imageDataURL }: HandleCreateMessageArgs) {
		const newMessage = await addDoc(roomMessagesRef, {
			createdAt: serverTimestamp(),
			imageBlob: imageDataURL,
			text
		});
	}

	function handleNameBlur() {
		// firestoreDb.doc(`rooms/${id}`).update({ name: roomNameInputValue });
	}

	function handleNameKeypress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			textAreaElement?.blur();
		}
	}

	function testUse(element: HTMLElement) {
		let resizeRAFId: number;

		function resize() {
			element.style.width = '1px';
			element.style.width = +element.scrollWidth + 'px';
			resizeRAFId = window.requestAnimationFrame(resize);
		}
		resizeRAFId = window.requestAnimationFrame(resize);

		return {
			destroy: () => window.cancelAnimationFrame(resizeRAFId)
		};
	}
</script>

<svelte:head>
	<title>{unreadCount ? `[${unreadCount}] ${roomName} - Dither` : `${roomName} - Dither`}</title>
</svelte:head>

<div class="content">
	<div class="room-name-container">
		—
		<textarea
			class="room-name"
			rows="1"
			maxlength="55"
			bind:this={textAreaElement}
			bind:value={roomNameInputValue}
			on:blur={handleNameBlur}
			on:keypress={handleNameKeypress}
			use:testUse
		></textarea>
		—
	</div>
	{#if NewMessage}<NewMessage onCreateMessage={handleCreateMessage} />{/if}

	<ul class="messages">
		{#if messages.length === 0}
			<p>Nothing has been said.</p>
			<p>Click ➪ to say something</p>
		{/if}
		{#each messages as { id, text, imageBlob }, i (id)}
			<li animate:flip={{ duration: 200 }} in:receive={{ key: id }} out:send={{ key: id }}>
				<Message {text} {imageBlob} />
			</li>
		{/each}
	</ul>
</div>

<style>
	.content {
		width: 100%;
	}

	.room-name-container {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 0 10px 0;
	}

	.room-name {
		box-sizing: content-box;
		display: inline-block;
		margin: 0;
		padding: 10px;
		overflow: hidden;
		max-width: 100%;
		white-space: nowrap;
		font-size: 14px;
		resize: none;
		/* font-style: italic; */
		text-transform: uppercase;
		text-align: center;
		background: none;
		color: var(--white);
	}

	.room-name:focus {
		outline: none;
	}

	.messages {
		list-style-type: none;
		margin: 25px 0 0 0;
		padding: 0;
		text-align: center;
	}
</style>
