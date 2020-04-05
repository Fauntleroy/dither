<script>
  import { onMount } from 'svelte';

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
    animation: play-frames 1500ms steps(10, end) infinite;
    width: 100%;
    image-rendering: crisp-edges;
  }
</style>

<div class="filmstrip">
  <img class="image" src="/images/8-color-filmstrip-test.png" alt="" />
</div>