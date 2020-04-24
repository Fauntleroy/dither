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
  let textAreaElement;
  let inputValue = id;

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
        inputValue = room.name;
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
  
  function handleNameBlur () {
    firestoreDb.doc(`rooms/${id}`).update({ name: inputValue });
  }

  function handleNameKeypress (event) {
    if (event.key === 'Enter') {
      textAreaElement.blur();
    }
  }

  function testUse (element) {
    let resizeRAFId;

    function resize () {
      element.style.width = "1px";
      element.style.width = (+element.scrollWidth)+"px";
      resizeRAFId = window.requestAnimationFrame(resize);	
    }
    resizeRAFId = window.requestAnimationFrame(resize);

    return {
      destroy: () => window.cancelAnimationFrame(resizeRAFId)
    }
  }
</script>

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

<svelte:head>
	<title>{
    unreadCount
      ? `[${unreadCount}] ${roomName} - Dither`
      : `${roomName} - Dither`
  }</title>
</svelte:head>

<div class="content">
  <div class="room-name-container">
    — 
    <textarea
      type="text"
      class="room-name"
      rows="1"
      maxlength="55"
      bind:this={textAreaElement}
      bind:value={inputValue}
      on:blur={handleNameBlur}
      on:keypress={handleNameKeypress}
      use:testUse />
     —
  </div>
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