export function convertImageData(canvas: HTMLCanvasElement, colorPalette: [string, string]): void {
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Canvas context not available');
	}

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		const red = data[i];
		const green = data[i + 1];
		const blue = data[i + 2];

		// Calculate distances to both colors in the palette
		const distanceToColor1 = Math.sqrt(
			Math.pow(red - parseInt(colorPalette[0].slice(1, 3), 16), 2) +
				Math.pow(green - parseInt(colorPalette[0].slice(3, 5), 16), 2) +
				Math.pow(blue - parseInt(colorPalette[0].slice(5, 7), 16), 2)
		);

		const distanceToColor2 = Math.sqrt(
			Math.pow(red - parseInt(colorPalette[1].slice(1, 3), 16), 2) +
				Math.pow(green - parseInt(colorPalette[1].slice(3, 5), 16), 2) +
				Math.pow(blue - parseInt(colorPalette[1].slice(5, 7), 16), 2)
		);

		// Choose the closest color
		const closestColor = distanceToColor1 < distanceToColor2 ? colorPalette[0] : colorPalette[1];

		// Set the pixel to the closest color
		data[i] = parseInt(closestColor.slice(1, 3), 16);
		data[i + 1] = parseInt(closestColor.slice(3, 5), 16);
		data[i + 2] = parseInt(closestColor.slice(5, 7), 16);
	}

	ctx.putImageData(imageData, 0, 0);
}
