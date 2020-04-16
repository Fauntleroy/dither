<script>
  import { onMount } from 'svelte';
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { derived } from 'svelte/store';
  
  import { firestore, firestoreDb } from '../../firebase.js';
  import { pageVisible } from '../../store.js';

  import Message from '../../components/message.svelte';
  import NewMessage from '../../components/new-message.svelte';

  export let currentRoute;
  const { namedParams } = currentRoute;
  const { id } = namedParams;
  let unreadCount = 0;

  // firestore data
  let room;
  let messages = [];

  $: roomName = room ? room.name : id;

  const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 100),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 125,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	onMount(async () => {
    firestoreDb.collection('rooms').doc(id)
      .onSnapshot((doc) => {
        room = doc.data();
        console.log('room', room)
      });
    firestoreDb.collection(`rooms/${id}/messages`)
      .limit(10)
      .orderBy('createdAt', 'desc')
      .onSnapshot((collection) => {
        const docsData = collection.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        });
        messages = docsData;

        if (!$pageVisible) {
          unreadCount++;
        }
      });
  });

  pageVisible.subscribe(() => {
    unreadCount = 0;
  });

	async function handleCreateMessage (event) {
    const { text, imageDataURL } = event.detail;
		const newMessage = await firestoreDb.collection(`rooms/${id}/messages`).add({
      createdAt: firestore.FieldValue.serverTimestamp(),
      imageBlob: imageDataURL,
      text
    });
	}
</script>

<style>
  .content {
    width: 100%;
  }

  .room-name {
    font-size: 75%;
    /* font-style: italic; */
    text-transform: uppercase;
    text-align: center;
    margin: 0 0 10px 0;
  }

  .room-name:before {
    content: '—';
    margin-right: 5px;
  }

  .room-name:after {
    content: '—';
    margin-left: 5px;
  }

  .messages {
    list-style-type: none;
    margin: 25px 0 0 0;
    padding: 0;
    text-align: center;
  }
</style>

<svelte:head>
	<title>{
    unreadCount
      ? `[${unreadCount}] ${roomName} - Dither`
      : `${roomName} - Dither`
  }</title>
</svelte:head>

<div class="content">
  <h1 class="room-name">{roomName}</h1>
  <NewMessage on:createMessage={handleCreateMessage} />

  <ul class="messages">
    {#if messages.length === 0}
      <p>Nothing has been said.</p>
      <p>Click ➪ to say something</p>
    {/if}
    {#each messages as { id, text, imageBlob }, i (id)}
      <li animate:flip="{{duration: 200}}" in:receive="{{key: id}}" out:send="{{key: id}}">
        <Message text={text} imageBlob={imageBlob} />
      </li>
    {/each}
  </ul>
</div>