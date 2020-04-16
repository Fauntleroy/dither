<svelte:options accessors={true} />

<script>
  import Dither from 'canvas-dither';
  import throttle from 'just-throttle';
  import { onMount } from 'svelte';

  import { cameras, colorPalette, mediaDeviceId, mediaStream } from '../store.js';
  import { convertImageDataToColorPalette } from '../utils/canvas.js';

  const TARGET_WIDTH = 200;
  const TARGET_HEIGHT = 150;
  const TARGET_ASPECT = TARGET_WIDTH / TARGET_HEIGHT;

  export let displayCanvasElement;
  export let recordingCanvasElement;
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
    const displayCanvas2dContext = displayCanvasElement.getContext('2d');
    const recordingCanvas2dContext = recordingCanvasElement.getContext('2d');
    const { x, y, width, height } = getCrop();
    displayCanvas2dContext.drawImage(
      videoElement,
      x, y, width, height, // source (webcam)
      0, 0, canvasWidth, canvasHeight // destination (canvas)
    );
    const canvasImageData = displayCanvas2dContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const filteredImageData = Dither.atkinson(canvasImageData);
    recordingCanvas2dContext.putImageData(filteredImageData, 0, 0);
    const colorChangedImageData = convertImageDataToColorPalette(filteredImageData, $colorPalette);
    displayCanvas2dContext.putImageData(colorChangedImageData, 0, 0);
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

  function handleFeedClick (event) {
    console.log('$cameras', $cameras)
    console.log('$mediaDeviceId', $mediaDeviceId)
    const activeCameraIndex = $cameras.findIndex(camera => camera.deviceId === $mediaDeviceId);
    console.log('activeCameraIndex', activeCameraIndex)
    const nextCameraIndex = ($cameras.length - 1) > activeCameraIndex
      ? activeCameraIndex + 1
      : 0;
    console.log('nextCameraIndex', nextCameraIndex)
    const nextCameraDeviceId = $cameras[nextCameraIndex].deviceId;
  console.log('nextCameraDeviceId', nextCameraDeviceId)
    mediaDeviceId.set(nextCameraDeviceId);
    console.log('$mediaDeviceId', $mediaDeviceId)
  }
</script>

<style>
.stylized-webcam-feed {
  position: relative;
  cursor: pointer;
}
  .raw-webcam {
    max-width: 300px;
  }

  .display-webcam {
    display: block;
    width: 100%;
    height: 100%;
  }

  .display-webcam {
    background: var(--black);
  }

  .sekrit {
    position: fixed;
    z-index: 9999;
    top: -9999px;
    visibility: hidden;
  }
</style>

<div class="stylized-webcam-feed" on:click={handleFeedClick}>
  <video class="raw-webcam sekrit" bind:this={videoElement} />
  <canvas class="recording-webcam sekrit" width={TARGET_WIDTH} height={TARGET_HEIGHT} bind:this={recordingCanvasElement} />
  <canvas class="display-webcam" width={TARGET_WIDTH} height={TARGET_HEIGHT} bind:this={displayCanvasElement} />
</div>