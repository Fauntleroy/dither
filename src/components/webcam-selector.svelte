<script>
  import { createEventDispatcher, onMount } from 'svelte';

  import { cameras } from '../store.js';

  const dispatch = createEventDispatcher();

  function handleOptionClick (event) {
    dispatch('select', event.target.dataset.id);
  }
</script>

<style>
  .webcam-selector {
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    width: 250px;
    background: var(--white);
    color: var(--black);
    border-radius: 5px;
    padding: 10px;
    font-size: 75%;
    z-index: 5;
    border: var(--black) 1px solid;
  }

  .option {
    display: block;
    width: 100%;
  }
</style>

<div class="webcam-selector">
  {#each $cameras as { deviceId, label}, i (deviceId)}
    <button
      class="option"
      type="button"
      data-id={deviceId}
      on:click={handleOptionClick}>
      {label}
    </button>
  {/each}
</div>