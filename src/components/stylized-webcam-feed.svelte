<svelte:options accessors={true} />

<script>
  import getUserMedia from 'getusermedia';
  import attachMediaStream from 'attachmediastream';
  import Dither from 'canvas-dither';
  import throttle from 'just-throttle';
  import { onMount } from 'svelte';

  export let canvasElement;
  export let videoElement;
  let processedImageDrawRequestId;

  function drawProcessedImage () {
    console.log('drawProcessedImage')
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
    getUserMedia({
      video: true,
      audio: false
    }, (error, userMediaStream) => {
      if (error) {
        alert(error);
      } else {
        attachMediaStream(userMediaStream, videoElement);
      }
    });

    processedImageDrawRequestId = requestAnimationFrame(tryToDraw);

    return function onUnMount () {
      cancelAnimationFrame(processedImageDrawRequestId);
    }
  });
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
    width: 200px;
    height: 150px;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
  }

  .processed-webcam {
    background: black;
  }
</style>

<div class="stylized-webcam-feed">
  <video class="raw-webcam" width="200" height="150" bind:this={videoElement} />
  <canvas class="processed-webcam" width="200" height="150" bind:this={canvasElement} />
</div>