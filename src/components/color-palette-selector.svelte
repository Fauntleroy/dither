<script>
	import { colorPaletteId, colorPalette } from '../store.js';

	import { COLOR_PALETTES } from '../constants.js';

	function handleColorPaletteChange(event) {
		colorPaletteId.set(event.target.value);
	}

	colorPalette.subscribe(([black, white]) => {
		document.documentElement.style.setProperty('--black', black);
		document.documentElement.style.setProperty('--white', white);
	});
</script>

<select on:change={handleColorPaletteChange}>
	{#each Object.entries(COLOR_PALETTES) as [id, colorPalette] (id)}
		<option value={id} selected={$colorPaletteId === id}>{id}</option>
	{/each}
</select>

<style>
</style>
