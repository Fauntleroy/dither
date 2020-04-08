import GifEncoder from 'gif-encoder';

const FRAME_HEIGHT = 150;
const FRAME_WIDTH = 200;
const FRAMES_PER_SECOND = 10;
const DURATION = 2000;
const FRAME_DELAY = 1000 / FRAMES_PER_SECOND;
const FRAME_TOTAL = (DURATION / 1000) * FRAMES_PER_SECOND;

export function generateImage (targetCanvasElement) {
  const bufferCanvasElement = document.createElement('canvas');
  bufferCanvasElement.width = FRAME_WIDTH;
  bufferCanvasElement.height = FRAME_HEIGHT * FRAME_TOTAL;
  const bufferContext = bufferCanvasElement.getContext('2d');

  return new Promise((resolve) => {
    let frameCount = 0;

    function captureFrame () {
      const yOffset = frameCount * FRAME_HEIGHT;
      bufferContext.drawImage(targetCanvasElement, 0, yOffset, FRAME_WIDTH, FRAME_HEIGHT);
      frameCount++;

      if (frameCount < FRAME_TOTAL) {
        setTimeout(captureFrame, FRAME_DELAY);
      } else {
        const bufferDataURL = bufferCanvasElement.toDataURL('image/png');
        resolve(bufferDataURL);
      }
    }

    setTimeout(captureFrame, FRAME_DELAY);
  });
}

export function generateGIF (targetFilmstripElement) {
  const bufferCanvasElement = document.createElement('canvas');
  bufferCanvasElement.width = FRAME_WIDTH;
  bufferCanvasElement.height = FRAME_HEIGHT;
  const bufferContext = bufferCanvasElement.getContext('2d');

  return new Promise((resolve) => {
    const gif = new GifEncoder(FRAME_WIDTH, FRAME_HEIGHT, {
      highWaterMark: 128 * 1000
    });
    gif.writeHeader();
    gif.setDelay(100);
    gif.setRepeat(0);

    for (let i = 0; i < FRAME_TOTAL; i++) {
      bufferContext.drawImage(
        targetFilmstripElement,
        0, i * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT, // source
        0, 0, FRAME_WIDTH, FRAME_HEIGHT // destination
      );
      const bufferImageData = bufferContext.getImageData(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
      gif.addFrame(bufferImageData.data);
    }

    gif.on('readable', function () {
      const buffer = gif.read();
      const blob = new Blob([buffer], { type: 'image/gif' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = Date.now() + '.gif';

      const clickEvent = new MouseEvent('click');
      link.dispatchEvent(clickEvent);

      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    });

    gif.finish();
    resolve(gif);
  });
}