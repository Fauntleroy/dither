<script>
  import { onMount } from 'svelte';
  
  import { firestore, firestoreDb } from '../../firebase.js';

  import Message from '../../components/message.svelte';
  import NewMessage from '../../components/new-message.svelte';

  export let currentRoute;
  const { namedParams } = currentRoute;
  const { id } = namedParams;

  let messages = [];

	onMount(async () => {
    firestoreDb.collection(`rooms/${id}/messages`)
      .limit(10)
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
    width: 720px;
    margin: 0 auto;
  }
</style>

<svelte:head>
	<title>Room {id}</title>
</svelte:head>

<div class="content">
  <NewMessage on:createMessage={handleCreateMessage} />

  {#each messages as { id, text, imageBlob }, i (id)}
    <Message text={text} imageBlob={imageBlob} />
  {/each}
</div>