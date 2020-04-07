<script>
  import { onMount } from 'svelte';

  export let src;
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
    width: 300px;
    height: 225px;
    overflow: hidden;
    background: black;
  }

  .filmstrip .image {
    animation: play-frames 2000ms steps(20, end) infinite;
    width: 100%;
    image-rendering: crisp-edges;
  }
</style>

<div class="filmstrip">
  <img class="image" src={src} alt="" />
</div>