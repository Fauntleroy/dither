<script>
  import { createEventDispatcher } from 'svelte';

  import { generateImage } from '../utils/filmstrip.js';

  import StylizedWebcamFeed from './stylized-webcam-feed.svelte';
  import Filmstrip from './filmstrip.svelte';

  const dispatch = createEventDispatcher();
  let webcamFeed;
  let inputMessage = '';
  let recording = false;

  async function handleSubmit () {
    recording = true;
    const imageDataURL = await generateImage(webcamFeed.canvasElement);
    recording = false;

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
    justify-content: center;
  }

  .fake-input {
    display: flex;
    background: white;
    color: black;
    border: black 4px solid;
    border-radius: 3px;
  }

  .input {
    display: block;
    border: none;
    margin: 0;
    padding: 10px 15px;
    font-size: inherit;
  }

  .submit {
    padding: 10px;
    margin: 0;
    color: black;
    background: none;
    border: none;
    font-size: 40px;
    line-height: 40px;
    border-radius: 3px;
  }

  .recording-booth {
    position: relative;
  }

  .recording-indicator {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: block;
    border-radius: 50%;
    background: red;
    width: 10px;
    height: 10px;
  }
</style>

<div class="new-message">
  <form class="form" on:submit|preventDefault={handleSubmit}>
    <div class="recording-booth">
      <StylizedWebcamFeed bind:this={webcamFeed} />
      {#if recording}<span class="recording-indicator" />{/if}
    </div>
    <div class="fake-input">
      <input class="input" type="text" bind:value={inputMessage} placeholder="Type to GIF" disabled={recording} />
      <button class="submit" type="submit" disabled={recording}>➭</button>
    </div>
  </form>
</div>