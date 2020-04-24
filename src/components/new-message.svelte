<script>
  import { createEventDispatcher } from 'svelte';

  import { mediaStream, webcamEnabled } from '../store.js';
  import { generateImage } from '../utils/filmstrip.js';

  import StylizedWebcamFeed from './stylized-webcam-feed.svelte';
  import Filmstrip from './filmstrip.svelte';

  const dispatch = createEventDispatcher();
  let webcamFeed;
  let inputMessage = '';
  let recording = false;

  async function handleSubmit () {
    recording = true;
    const imageDataURL = await generateImage(webcamFeed.recordingCanvasElement);
    recording = false;

    dispatch('createMessage', {
      text: inputMessage,
      imageDataURL
    });

    inputMessage = '';
  }

  function handleInputKeydown (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit();
    }
  }

  function handleEnableWebcamClick () {
    webcamEnabled.set(true);
  }
</script>

<style>
  @keyframes indicatorGlow {
    from {
      background: rgba(255, 0, 0, 0.5);
    }
    to {
      background: red;
    }
  }

  .new-message {
    position: relative;
    max-width: 540px;
    margin: 0 auto;
  }

  .form {
    display: flex;
    align-items: stretch;
    margin: 0;
    justify-content: center;
  }

  .fake-input {
    display: flex;
    flex-grow: 1;
    position: relative;
    background: var(--white);
    color: var(--black);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: hidden;
    border: var(--white) 1px solid;
    transition: transform 200ms;
  }

  .input {
    display: block;
    border: none;
    margin: 0;
    border: 2px var(--white) solid;
    padding: 10px 50px 10px 15px;
    font-size: inherit;
    font-style: italic;
    width: 100%;
    resize: none;
  }

  .input:focus {
    outline: none;
  }

  .fake-input:focus-within {
    transform: scale(1.05);
  }

  .fake-input__action {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .submit {
    padding: 10px;
    margin: 0;
    color: var(--black);
    font-size: 40px;
    line-height: 40px;
  }

  .recording-booth {
    position: relative;
    border: var(--white) 1px solid;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    flex-shrink: 0;
    width: 150px;
    height: 113px;
  }

  .recording-indicator {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: block;
    border-radius: 50%;
    background: red;
    width: 10px;
    height: 10px;
    animation: indicatorGlow 500ms linear alternate infinite;
  }

  .recording-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: var(--white);
    transition: width 200ms;
  }

  .new-message.recording .recording-progress {
    width: 100%;
    transition: width 2000ms linear;
  }

  .enable-webcam-message__container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .enable-webcam-message {
    white-space: pre;
  }

  @media (max-width: 480px) {
    .recording-booth {
      width: 100px;
      height: 75px;
    }
  }
</style>

<div class="new-message" class:recording>
  <form class="form" on:submit|preventDefault={handleSubmit}>
    <div class="recording-booth">
      <StylizedWebcamFeed bind:this={webcamFeed} />
      {#if recording}<span class="recording-indicator" />{/if}
      <div class="recording-progress" />
    </div>
    <div class="fake-input">
      <textarea
        class="input"
        type="text"
        bind:value={inputMessage}
        on:keydown={handleInputKeydown}
        placeholder="Type to GIF"
        disabled={!$mediaStream || recording} />
      <span class="fake-input__action">
        <button class="submit blend" type="submit" disabled={!$mediaStream || recording}>➪</button>
      </span>
    </div>
  </form>
  {#if !$webcamEnabled}
    <div class="enable-webcam-message__container">
      <button class="dark enable-webcam-message" on:click={handleEnableWebcamClick}>
        <em>Click</em> to enable your webcam and chat<em>!</em>
      </button>
    </div>
  {/if}
</div>