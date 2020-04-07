<script>
  import Filmstrip from './filmstrip.svelte';

  export let imageBlob;
  export let text;
</script>

<style>
  .message {
    display: flex;
    align-items: center;
  }

  .text {
    padding: 30px;
    font-size: 150%;
    background: white;
    border-radius: 3px;
    margin: 0 0 0 -30px;
    z-index: 2;
    border: 2px black dotted;
  }
</style>

<div class="message">
  <Filmstrip src={imageBlob} />
  <div class="text">{text}</div>
</div>
