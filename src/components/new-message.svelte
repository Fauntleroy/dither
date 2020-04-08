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

  function handleInputKeydown (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit();
    }
  }
</script>

<style>
  .new-message {
    margin: 25px 0;
  }

  .form {
    display: flex;
    align-items: stretch;
    margin-bottom: 15px;
    justify-content: center;
  }

  .fake-input {
    display: flex;
    background: white;
    color: black;
    border-radius: 5px;
  }

  .input {
    display: block;
    border: none;
    margin: 0;
    padding: 10px 15px;
    font-size: inherit;
    font-style: italic;
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
    border: white 1px solid;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow: hidden;
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
      <textarea
        class="input"
        type="text"
        bind:value={inputMessage}
        on:keydown={handleInputKeydown}
        placeholder="Type to GIF"
        disabled={recording} />
      <button class="submit" type="submit" disabled={recording}>➭</button>
    </div>
  </form>
</div>