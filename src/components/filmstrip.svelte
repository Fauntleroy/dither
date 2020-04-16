<script>
  import { onMount } from 'svelte';
  import hexRgb from 'hex-rgb';

  import { generateGIF } from '../utils/filmstrip.js';
  import { convertImageDataToColorPalette } from '../utils/canvas.js';
  import { colorPalette } from '../store.js';

  export let src;
  let canvasElement;

  onMount(() => {
    drawDataURIOnCanvas(src);

    const colorPaletteUnsubscribe = colorPalette.subscribe(() => drawDataURIOnCanvas(src));

    return () => {
      colorPaletteUnsubscribe();
    };
  });

  function drawDataURIOnCanvas (strDataURI) {
    const tempImage = new Image();

    function drawDataFromImage () {
      const canvasContext = canvasElement.getContext('2d');
      canvasContext.drawImage(tempImage, 0, 0);
      const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const convertedImageData = convertImageDataToColorPalette(imageData, $colorPalette);
      canvasContext.putImageData(convertedImageData, 0, 0);
    }

    tempImage.addEventListener('load', drawDataFromImage);
    tempImage.setAttribute("src", strDataURI);
  }

  function handleDownloadClick () {
    console.log('handleDownloadClick()')
    generateGIF(canvasElement);
  }
</script>

<style>
  @keyframes play-frames {
    from {
      transform: translateY(0%);
    }
    to {
      transform: translateY(-100%);
    }
  }

  .filmstrip {
    position: relative;
    width: 300px;
    height: 225px;
    max-width: 100%;
    overflow: hidden;
    background: var(--black);
    border: var(--white) 1px solid;
    border-radius: 5px;
  }

  .canvas {
    animation: play-frames 2000ms steps(20, end) infinite;
    width: 100%;
    image-rendering: crisp-edges;
  }

  .download {
    opacity: 0;
    transition: opacity 200ms, transform 200ms;
    transform: scale(0.9);
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .filmstrip:hover .download {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: 600px) {
    .filmstrip {
      width: 200px;
      height: 150px;
    }
  }
</style>

<div class="filmstrip">
  <canvas class="canvas" width="200" height="3000" bind:this={canvasElement} />
  <button class="download" type="button" on:click={handleDownloadClick}>Save  ▿</button>
</div>