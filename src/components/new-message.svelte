<script>
  import { createEventDispatcher } from 'svelte';

  import { generateImage } from '../utils/filmstrip.js';

  import StylizedWebcamFeed from './stylized-webcam-feed.svelte';
  import Filmstrip from './filmstrip.svelte';

  const dispatch = createEventDispatcher();
  let webcamFeed;
  let inputMessage = '';

  async function handleSubmit () {
    const imageDataURL = await generateImage(webcamFeed.canvasElement);

    dispatch('createMessage', {
      text: inputMessage,
      imageDataURL
    });

    inputMessage = '';
  }
</script>

<style>
  .form {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .input {
    background: white;
    color: black;
    border: black 4px solid;
    border-radius: 3px;
    padding: 15px 20px;
    font-size: inherit;
    margin: 0 5px 0 -30px;
  }

  .submit {
    background: black;
    border: 4px black solid;
    color: white;
    font-size: inherit;
    padding: 15px 20px;
    border-radius: 3px;
  }
</style>

<div class="new-message">
  <form class="form" on:submit|preventDefault={handleSubmit}>
    <StylizedWebcamFeed bind:this={webcamFeed} />
    <input class="input" type="text" bind:value={inputMessage} placeholder="Type to GIF" />
    <button class="submit" type="submit">Send GIF</button>
  </form>
</div>