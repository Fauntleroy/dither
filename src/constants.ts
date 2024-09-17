export const COLOR_PALETTES = {
	JD093A: ['#121D1D', '#D2FFF8'],
	Macintosh: ['#333319', '#e5ffff'],
	'Zenith ZVM 1240': ['#342119', '#FFD880'],
	'Commodore 1084': ['#392F6D', '#9CE4EB'],
	'IBM 5151': ['#25332F', '#01EB61'],
	'IBM 8503': ['#222329', '#F5EFD8'],
	'Metal Gear': ['#111111', '#74da9e'],
	'Black & White': ['#000000', '#ffffff'],
	Grayscale: ['#222222', '#DDDDDD']
} as const;

export type ColorPaletteId = keyof typeof COLOR_PALETTES;

export const CAMERA_RESOLUTIONS = {
	'200 x 150': [200, 150],
	'320 x 240': [320, 240],
	'480 x 360': [480, 360],
	'640 x 480': [640, 480]
} as const;

export type CameraResolutionId = keyof typeof CAMERA_RESOLUTIONS;

export const STORE_WEBCAM_ENABLED = 'dither:webcamEnabled';
export const STORE_COLOR_PALETTE_ID = 'dither:colorPaletteId';
export const STORE_ROOM_HISTORY = 'dither:roomHistory';
export const STORE_CAMERA_RESOLUTION_ID = 'dither:resolutionId';
