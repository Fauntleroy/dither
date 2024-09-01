<script lang="ts">
	let Filmstrip;

	export async function onMount() {
		const module = await import('./filmstrip.svelte');
		Filmstrip = module.default as typeof module.default; // Type assertion
	}

	export let imageBlob;
	export let text;
</script>

<div class="message">
	<div class="image">
		{#if Filmstrip}<Filmstrip src={imageBlob} />{/if}
	</div>
	<div class="text">{text || '…'}</div>
</div>

<style>
	.message {
		display: flex;
		align-items: center;
		margin-bottom: 25px;
	}

	.image {
		flex-shrink: 0;
	}

	.text {
		flex-grow: 1;
		margin-left: -10px;
		padding: 15px 20px;
		background: var(--black);
		color: var(--white);
		border: var(--white) 1px solid;
		border-radius: 5px;
		z-index: 2;
	}
</style>
