<script>
	import { colorPaletteId, colorPalette } from '../store.js';

	import { COLOR_PALETTES } from '../constants.js';

	function handleColorPaletteChange (event) {
		colorPaletteId.set(event.target.value);
	}

	colorPalette.subscribe(([black, white]) => {
		document.documentElement.style.setProperty('--black', black);
		document.documentElement.style.setProperty('--white', white);
	});
</script>

<style>
	.nav {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		padding: 0 10px;
		z-index: 5;
		background: var(--black);
		font-size: 14px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.app-name {
		text-transform: uppercase;
	}

	.alpha-tag {
		font-style: italic;
		text-transform: none;
	}
</style>

<nav class="nav">
	<a href="/" class="app-name">Dither <span class="alpha-tag">alpha</span></a>
	<select on:change={handleColorPaletteChange}>
		{#each Object.entries(COLOR_PALETTES) as [id, colorPalette] (id)}
			<option value={id} selected={$colorPaletteId === id}>{id}</option>
		{/each}
	</select>
</nav>
