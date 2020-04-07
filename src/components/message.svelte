<script>
  import Filmstrip from './filmstrip.svelte';

  export let imageBlob;
  export let text;
</script>

<style>
  .message {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .text {
    margin-top: -10px;
    padding: 15px 20px;
    background: black;
    color: white;
    border-radius: 3px;
    z-index: 2;
  }
</style>

<div class="message">
  <Filmstrip src={imageBlob} />
  <div class="text">{text}</div>
</div>
