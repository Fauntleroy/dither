<script>
  import { generateImage } from '../utils/filmstrip.js';

  import StylizedWebcamFeed from './stylized-webcam-feed.svelte';
  import Filmstrip from './filmstrip.svelte';

  let webcamFeed;
  let inputMessage = '';
  let testDataURL = '';

  async function handleSubmit () {
    console.log('sending message:', inputMessage);
    console.log('webcam feed', webcamFeed);
    console.log('webcam feed canvas element', webcamFeed.canvasElement);
    const imageDataURL = await generateImage(webcamFeed.canvasElement);
    testDataURL = imageDataURL;
  }
</script>

<style>
  
</style>

<div class="new-message">
  {#if testDataURL}
    <Filmstrip src={testDataURL} />
  {/if}
  <form on:submit|preventDefault={handleSubmit}>
    <StylizedWebcamFeed bind:this={webcamFeed} />
    <input type="text" bind:value={inputMessage} placeholder="Type to GIF" />
    <button type="submit">Send GIF</button>
  </form>
</div>