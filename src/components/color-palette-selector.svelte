<script lang="ts">
	import { colorPaletteId, colorPalette } from '$/store.svelte.js';

	import { COLOR_PALETTES, type ColorPaletteId } from '$/constants.js';

	function handleColorPaletteChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		colorPaletteId.set(target.value as ColorPaletteId);
	}

	colorPalette.subscribe(([black, white]) => {
		document.documentElement.style.setProperty('--black', black);
		document.documentElement.style.setProperty('--white', white);
	});
</script>

<select onchange={handleColorPaletteChange}>
	{#each Object.entries(COLOR_PALETTES) as [id, colorPalette] (id)}
		<option value={id} selected={$colorPaletteId === id}>{id}</option>
	{/each}
</select>

<style>
</style>
