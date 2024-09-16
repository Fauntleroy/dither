import workerUrl from 'modern-gif/worker?url';

import { convertImageData } from './canvas';

const FRAME_HEIGHT = 150;
const FRAME_WIDTH = 200;
const FRAMES_PER_SECOND = 10;
const DURATION = 2000;
const FRAME_DELAY = 1000 / FRAMES_PER_SECOND;
const FRAME_TOTAL = (DURATION / 1000) * FRAMES_PER_SECOND;

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateOptimizedPngFromCanvas(canvasElement: HTMLCanvasElement): Promise<Blob> {
	const uPNG = (await import('upng-js')).default;

	// Get image data from canvas
	const context = canvasElement.getContext('2d', { willReadFrequently: true });
	if (!context) {
		throw new Error('Canvas context not available');
	}
	const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);

	// Encode black and white image with UPNG, optimizing for minimal size
	const optimizedUpngImage = uPNG.encode(
		[imageData.data.buffer],
		imageData.width,
		imageData.height,
		2 + 1
	);

	// Convert optimized UPNG data to Blob
	return new Blob([optimizedUpngImage], { type: 'image/png' });
}

export function generateImage(targetCanvasElement: HTMLCanvasElement): Promise<Blob> {
	const bufferCanvasElement = document.createElement('canvas');
	bufferCanvasElement.width = FRAME_WIDTH;
	bufferCanvasElement.height = FRAME_HEIGHT * FRAME_TOTAL;
	const bufferContext = bufferCanvasElement.getContext('2d');

	if (!bufferContext) {
		bufferCanvasElement.remove();
		console.error('Error creating 2d canvas context while generating GIF');
		return Promise.reject('Error creating 2d canvas context while generating GIF');
	}

	return new Promise((resolve, reject) => {
		let frameCount = 0;

		function captureFrame() {
			if (!bufferContext) {
				bufferCanvasElement.remove();
				console.error('Error creating 2d canvas context while capturing frames');
				return reject('Error creating 2d canvas context while capturing frames');
			}

			const yOffset = frameCount * FRAME_HEIGHT;
			bufferContext.drawImage(targetCanvasElement, 0, yOffset, FRAME_WIDTH, FRAME_HEIGHT);
			frameCount++;

			if (frameCount < FRAME_TOTAL) {
				setTimeout(captureFrame, FRAME_DELAY);
			} else {
				(async function () {
					try {
						const optimizedPngBlob = await generateOptimizedPngFromCanvas(bufferCanvasElement);
						resolve(optimizedPngBlob);
					} catch (imageGenerationError) {
						reject(imageGenerationError);
					} finally {
						bufferCanvasElement.remove();
					}
				})();
			}
		}

		setTimeout(captureFrame, FRAME_DELAY);
	});
}

export async function generateGIF(
	targetElement: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement,
	sourceType: 'stream' | 'filmstrip' = 'filmstrip',
	colorPalette: [string, string],
	width: number = FRAME_WIDTH,
	height: number = FRAME_HEIGHT
): Promise<Blob | undefined> {
	const { encode } = await import('modern-gif');

	const bufferCanvasElement: HTMLCanvasElement = document.createElement('canvas');
	bufferCanvasElement.width = width;
	bufferCanvasElement.height = height;
	const bufferContext = bufferCanvasElement.getContext('2d');

	if (!bufferContext) {
		console.error('Error creating 2d canvas context while generating GIF');
		return;
	}

	const frames = [];

	if (sourceType === 'filmstrip') {
		for (let i = 0; i < FRAME_TOTAL; i++) {
			bufferContext.drawImage(
				targetElement,
				0,
				i * height,
				width,
				height, // source
				0,
				0,
				width,
				height // destination
			);
			convertImageData(bufferCanvasElement, colorPalette);
			const bufferImageData = bufferContext.getImageData(0, 0, width, height);
			frames.push({ data: bufferImageData.data, delay: FRAME_DELAY });
		}
	} else {
		async function addFrame() {
			if (!bufferContext) {
				throw new Error('buffer context does not exist');
			}

			bufferContext.drawImage(
				targetElement,
				0,
				0,
				width,
				height, // source
				0,
				0,
				width,
				height // destination
			);
			convertImageData(bufferCanvasElement, colorPalette);
			const bufferImageData = bufferContext.getImageData(0, 0, width, height);
			frames.push({ data: bufferImageData.data, delay: FRAME_DELAY });
			if (frames.length < FRAME_TOTAL) {
				await wait(FRAME_DELAY);
				return await addFrame();
			}
		}
		await addFrame();
	}

	const output = await encode({
		// workerUrl is optional
		workerUrl,
		width: width,
		height: height,
		frames
	});
	bufferCanvasElement.remove();

	const blob = new Blob([output], { type: 'image/gif' });
	return blob;
}

export function downloadFile(blob: Blob, fileName: string) {
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${fileName}.gif`;
	const clickEvent = new MouseEvent('click');
	link.dispatchEvent(clickEvent);
	setTimeout(() => window.URL.revokeObjectURL(url), 100);
}
