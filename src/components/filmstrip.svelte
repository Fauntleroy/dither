<script>
  import { onMount } from 'svelte';

  import { generateGIF } from '../utils/filmstrip.js';

  export let src;
  let imageElement;

  function handleDownloadClick () {
    console.log('handleDownloadClick()')
    generateGIF(imageElement);
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
    border: white 1px solid;
    border-radius: 5px;
  }

  .image {
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
  <img class="image" src={src} alt="" bind:this={imageElement} />
  <button class="download" type="button" on:click={handleDownloadClick}>Save  ▿</button>
</div>