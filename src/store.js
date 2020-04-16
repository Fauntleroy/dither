import { derived, readable, writable } from 'svelte/store';
import store from 'store';

import { COLOR_PALETTES, STORE_COLOR_PALETTE_ID } from './constants.js';

export const pageVisible = readable(!document.hidden, (set) => {
  function handleVisibilityChange () {
    set(!document.hidden);
  }

  document.addEventListener(
    'visibilitychange',
    handleVisibilityChange,
    false
  );

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange, false);
  };
});

export const mediaDeviceId = writable(null, (set) => {
  const camerasUnubscribe = cameras.subscribe((cameras) => {
    if (cameras.length) {
      set(cameras[0].deviceId);
    }

    setTimeout(() => camerasUnubscribe(), 1);
  });
});

// hack, wish this was in the store code
// how do i get previous store value in the updater?
let previousMediaStream;
async function getMediaStream (deviceId) {
  if (!deviceId) {
    return;
  }
  if (previousMediaStream) {
    previousMediaStream.getVideoTracks()[0].stop();
  }
  const userMediaStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      deviceId: {
        ideal: deviceId
      },
      aspectRatio: {
        ideal: 4 / 3
      },
      frameRate: {
        ideal: 10
      },
      width: {
        ideal: 640
      },
      height: {
        ideal: 480
      }
    }
  });

  previousMediaStream = userMediaStream;
  return userMediaStream;
}

export const mediaStream = derived([mediaDeviceId], async ([$mediaDeviceId], set) => {
  try {
    const userMediaStream = await getMediaStream($mediaDeviceId);

    set(userMediaStream);
  } catch (error) {
    console.log('Unable to activate webcam: ', error);
    alert('Unable to activate webcam!');
  }
});

async function getCameras () {
  let cameras = [];

  try {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = mediaDevices.filter(mediaDevice => mediaDevice.kind === 'videoinput');
    cameras = videoDevices;
  } catch (error) {
    console.log('could not get the devices', error);
  }

  return cameras;
}

export const cameras = readable([], async (set) => {
  const cameras = await getCameras();
  set(cameras);

  async function handleDeviceChange (event) {
    const cameras = await getCameras();
    set(cameras);
  }

  navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

  return () => {
    navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
  }
}, []);

export const colorPaletteId = writable(store.get(STORE_COLOR_PALETTE_ID) || 'Black & White');

colorPaletteId.subscribe((newColorPaletteId) => store.set(STORE_COLOR_PALETTE_ID, newColorPaletteId));

export const colorPalette = derived([colorPaletteId], ([$colorPaletteId], set) => {
  set(COLOR_PALETTES[$colorPaletteId]);
});