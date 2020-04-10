<svelte:options accessors={true} />

<script>
  import Dither from 'canvas-dither';
  import throttle from 'just-throttle';
  import { onMount } from 'svelte';

  import { mediaDeviceId, mediaStream } from '../store.js';

  import WebcamSelector from './webcam-selector.svelte';

  const TARGET_WIDTH = 200;
  const TARGET_HEIGHT = 150;
  const TARGET_ASPECT = TARGET_WIDTH / TARGET_HEIGHT;

  export let canvasElement;
  export let videoElement;
  let canvasWidth = TARGET_WIDTH;
  let canvasHeight = TARGET_HEIGHT;
  let processedImageDrawRequestId;

  function getCrop () {
    const { videoWidth, videoHeight } = videoElement;
    const webcamVideoAspect = videoWidth / videoHeight;
    let width, height;

    if (webcamVideoAspect > TARGET_ASPECT) {
      height = videoHeight;
      width = height * TARGET_ASPECT;
    } else {
      width = videoWidth;
      height = width / TARGET_ASPECT;
    }

    const x = (videoWidth / 2) - (width / 2);
    const y = (videoHeight / 2) - (height / 2);

    return { x, y, width, height };
  }

  function drawProcessedImage () {
    const canvas2dContext = canvasElement.getContext('2d');
    const { x, y, width, height } = getCrop();
    canvas2dContext.drawImage(
      videoElement,
      x, y, width, height, // source (webcam)
      0, 0, canvasWidth, canvasHeight // destination (canvas)
    );
    const canvasImageData = canvas2dContext.getImageData(0, 0, canvasWidth, canvasHeight);
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
.stylized-webcam-feed {
  position: relative;
}
  .raw-webcam {
    position: fixed;
    z-index: 9999;
    top: -9999px;
    visibility: hidden;
    max-width: 300px;
  }

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
  <video class="raw-webcam" bind:this={videoElement} />
  <canvas class="processed-webcam" width={TARGET_WIDTH} height={TARGET_HEIGHT} bind:this={canvasElement} on:click={handleFeedClick} />
  {#if showWebcamSelector}<WebcamSelector on:select={handleWebcamSelect} />{/if}
</div>