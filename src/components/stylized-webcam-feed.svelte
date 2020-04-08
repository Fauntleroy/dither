<svelte:options accessors={true} />

<script>
  import Dither from 'canvas-dither';
  import throttle from 'just-throttle';
  import { onMount } from 'svelte';

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
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        aspectRatio: {
          ideal: 4 / 3
        },
        frameRate: {
          ideal: 10
        },
        width: {
          ideal: 640
        },
        height: {
          ideal: 480
        }
      }
    }).then((mediaStream) => {
      videoElement.srcObject = mediaStream;
      videoElement.play();
    }).catch((error) => {
      alert(error);
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

  @media (max-width: 480px) {
    .raw-webcam,
    .processed-webcam {
      width: 100px;
      height: 75px;
    }
  }
</style>

<div class="stylized-webcam-feed">
  <video class="raw-webcam" width="200" height="150" bind:this={videoElement} />
  <canvas class="processed-webcam" width="200" height="150" bind:this={canvasElement} />
</div>