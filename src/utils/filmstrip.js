const FRAME_DELAY = 100;
const FRAME_TOTAL = 20;
const FRAME_HEIGHT = 150;
const FRAME_WIDTH = 200;

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