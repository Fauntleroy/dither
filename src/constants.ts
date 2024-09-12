export const COLOR_PALETTES = {
	JD093A: ['#121D1D', '#D2FFF8'],
	Macintosh: ['#333319', '#e5ffff'],
	'Zenith ZVM 1240': ['#40291E', '#FDCA55'],
	'Commodore 1084': ['#392F6D', '#9CE4EB'],
	'IBM 5151': ['#25332F', '#01EB61'],
	'IBM 8503': ['#2E2F36', '#EBE5CE'],
	'Metal Gear': ['#111111', '#74da9e'],
	'Black & White': ['#000000', '#ffffff'],
	Grayscale: ['#222222', '#DDDDDD']
} as const;

export type ColorPaletteId = keyof typeof COLOR_PALETTES;

export const STORE_WEBCAM_ENABLED = 'dither:webcamEnabled';
export const STORE_COLOR_PALETTE_ID = 'dither:colorPaletteId';
export const STORE_ROOM_HISTORY = 'dither:roomHistory';
