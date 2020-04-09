<script>
  import Filmstrip from './filmstrip.svelte';

  export let imageBlob;
  export let text;
</script>

<style>
  .message {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }

  .image {
    flex-shrink: 0;
  }

  .text {
    margin-left: -10px;
    padding: 15px 20px;
    background: var(--black);
    color: var(--white);
    border: var(--white) 1px solid;
    border-radius: 5px;
    z-index: 2;
  }
</style>

<div class="message">
  <div class="image">
    <Filmstrip src={imageBlob} />
  </div>
  <div class="text">{text}</div>
</div>
