<svelte:options accessors={true} />

<script>
  import Dither from 'canvas-dither';
  import throttle from 'just-throttle';
  import { onMount } from 'svelte';

  import { mediaDeviceId, mediaStream } from '../store.js';

  import WebcamSelector from './webcam-selector.svelte';

  export let canvasElement;
  export let videoElement;
  let processedImageDrawRequestId;

  function drawProcessedImage () {
    const canvas2dContext = canvasElement.getContext('2d');
    canvas2dContext.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    const canvasImageData = canvas2dContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const filteredImageData = Dither.atkinson(canvasImageData);
    canvas2dContext.putImageData(filteredImageData, 0, 0);
  }

  const throttledDrawProcessedImage = throttle(drawProcessedImage, 100, true);
    
  function tryToDraw () {
    throttledDrawProcessedImage();

    processedImageDrawRequestId = requestAnimationFrame(tryToDraw);
  }

  onMount(() => {
    const mediaStreamUnsubscribe = mediaStream.subscribe((mediaStreamValue) => {
      videoElement.srcObject = null;
      videoElement.srcObject = mediaStreamValue;
      videoElement.play();

      cancelAnimationFrame(processedImageDrawRequestId);
      processedImageDrawRequestId = requestAnimationFrame(tryToDraw);
    });

    return function onUnMount () {
      cancelAnimationFrame(processedImageDrawRequestId);
      mediaStreamUnsubscribe();
    }
  });

  let showWebcamSelector = false;
  function handleFeedClick () {
    showWebcamSelector = !showWebcamSelector;
  }

  function handleWebcamSelect (event) {
    const deviceId = event.detail;
    mediaDeviceId.set(deviceId);
    showWebcamSelector = false;
  }
</script>

<style>
  .raw-webcam {
    position: fixed;
    top: -9999px;
    visibility: hidden;
  }

  .raw-webcam,
  .processed-webcam {
    display: block;
    width: 100%;
    height: 100%;
  }

  .processed-webcam {
    background: var(--black);
  }
</style>

<div class="stylized-webcam-feed">
  <video class="raw-webcam" width="200" height="150" bind:this={videoElement} />
  <canvas class="processed-webcam" width="200" height="150" bind:this={canvasElement} on:click={handleFeedClick} />
  {#if showWebcamSelector}<WebcamSelector on:select={handleWebcamSelect} />{/if}
</div>