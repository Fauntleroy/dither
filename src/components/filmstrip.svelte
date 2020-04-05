<script>
  import { onMount } from 'svelte';

  export let src;

  onMount(() => {
    const filmstripInterval = setInterval(() => {

    }, );
  })
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
    width: 400px;
    height: 300px;
    overflow: hidden;
  }

  .filmstrip .image {
    animation: play-frames 1500ms steps(20, end) infinite;
    width: 100%;
    image-rendering: crisp-edges;
  }
</style>

<div class="filmstrip">
  <img class="image" src={src} alt="" />
</div>