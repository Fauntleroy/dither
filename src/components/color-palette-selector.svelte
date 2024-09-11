<script lang="ts">
	import { colorPaletteId, colorPalette } from '$/store.svelte.js';

	import { COLOR_PALETTES, type ColorPaletteId } from '$/constants.js';

	import Select from './select.svelte';

	interface ColorPaletteChangeEvent {
		value: string;
	}

	function handleColorPaletteChange(event: ColorPaletteChangeEvent) {
		colorPaletteId.set(event.value as ColorPaletteId);
	}

	colorPalette.subscribe(([black, white]) => {
		document.documentElement.style.setProperty('--black', black);
		document.documentElement.style.setProperty('--white', white);
	});

	const options = Object.keys(COLOR_PALETTES).map((key) => {
		const colorPalette = COLOR_PALETTES[key];
		return {
			label: key,
			children: key,
			value: key
		};
	});
</script>

<Select
	{options}
	name="color-palette-selector"
	prefix="Theme:"
	onSelectedChange={handleColorPaletteChange}
	selected={{ value: $colorPaletteId, label: $colorPaletteId, children: $colorPaletteId }}
/>

<style>
</style>
