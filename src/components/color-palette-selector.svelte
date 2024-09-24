<script lang="ts">
	import { colorPaletteId, colorPalette } from '$/store.svelte.js';
	import { updateCursorColors } from '$/utils/cursor';

	import { COLOR_PALETTES, type ColorPaletteId } from '$/constants.js';

	import Select from './select.svelte';

	function handleColorPaletteChange(event: any) {
		colorPaletteId.set(event.value as ColorPaletteId);
	}

	colorPalette.subscribe(([black, white]) => {
		document.documentElement.style.setProperty('--black', black);
		document.documentElement.style.setProperty('--white', white);

		updateCursorColors(black, white);
	});

	const colorPalettesKeys = Object.keys(COLOR_PALETTES) as (keyof typeof COLOR_PALETTES)[];
	const options = colorPalettesKeys.map((key) => {
		const [black, white] = COLOR_PALETTES[key];
		return {
			label: key,
			children: key,
			value: key,
			style: `--black: ${black}; --white: ${white}`
		};
	});
</script>

<Select
	{options}
	name="color-palette-selector"
	prefix="Theme:"
	placeholder="None"
	onSelectedChange={handleColorPaletteChange}
	selected={{ value: $colorPaletteId, label: $colorPaletteId, children: $colorPaletteId }}
/>

<style>
</style>
