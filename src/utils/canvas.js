import hexRgb from 'hex-rgb';

export function convertImageDataToColorPalette (imageData, colorPalette) {
  const [black, white] = colorPalette;
  const blackRgb = hexRgb(black, { format: 'array' });
  const whiteRgb = hexRgb(white, { format: 'array' });

  let r, g, b;
  for (let p = 0, len = imageData.data.length; p < len; p+=4) {
    r = imageData.data[p]
    g = imageData.data[p+1];
    b = imageData.data[p+2];
    // alpha channel (p+3) is ignored
    if (r === 0 && g === 0 && b === 0) {
      imageData.data[p] = blackRgb[0];
      imageData.data[p + 1] = blackRgb[1];
      imageData.data[p + 2] = blackRgb[2];
    } else if (r === 255 && g === 255 && b === 255) {
      imageData.data[p] = whiteRgb[0];
      imageData.data[p + 1] = whiteRgb[1];
      imageData.data[p + 2] = whiteRgb[2];
    }
  }
  return imageData;
}