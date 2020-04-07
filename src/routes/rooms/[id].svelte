<script context="module">
  export function preload (page) {
    const { params } = page;

    return { params };
  }
</script>

<script>
  import { onMount } from 'svelte';

  import Message from '../../components/message.svelte';

  let firestore;
  let firestoreDb;
  let messages = [];

	onMount(async () => {
    const firebase = await import('../../firebase.js');
    firestoreDb = firebase.firestoreDb;
    firestore = firebase.firestore;

    firestoreDb.collection(`rooms/${params.id}/messages`)
      .limit(5)
      .orderBy('createdAt', 'desc')
      .onSnapshot(function(collection) {
          console.log("Current data: ", collection.docs);
          const docsData = collection.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data()
            }
          });
          console.log('docsData', docsData);
          messages = docsData;
      });
  });
  
  import NewMessage from '../../components/new-message.svelte';

	async function handleCreateMessage (event) {
    const { text, imageDataURL } = event.detail;
		const newMessage = await firestoreDb.collection(`rooms/${params.id}/messages`).add({
      createdAt: firestore.FieldValue.serverTimestamp(),
      imageBlob: imageDataURL,
      text
    });
	}

  export let params;
</script>

<style>
  .content {
    width: 720px;
    margin: 0 auto;
  }
</style>

<svelte:head>
	<title>Room {params.id}</title>
</svelte:head>

<div class="content">
	This is room {params.id}.

  <NewMessage on:createMessage={handleCreateMessage} />

  {#each messages as { id, text, imageBlob }, i (id)}
    <Message text={text} imageBlob={imageBlob} />
  {/each}
</div>