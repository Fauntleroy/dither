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

  let messages = [];

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
    firestoreDb.collection(`rooms/${id}/messages`)
      .limit(10)
      .orderBy('createdAt', 'desc')
      .onSnapshot(function(collection) {
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
      ? `[${unreadCount}] Dither: ${id}`
      : `Dither: ${id}`
  }</title>
</svelte:head>

<div class="content">
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