<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children, ...restProps }: Props = $props();
</script>

<button {...restProps}>
	<div class="inner">{@render children()}</div>
</button>

<style>
	button {
		--border-radius: 0.5em;
		--outer-border-width: 3px;
		--transition-duration: 150ms;
		background: var(--white);
		padding: var(--outer-border-width);
		border-radius: var(--border-radius);
		border: var(--black) 1px solid;
	}

	.inner {
		border: var(--black) 1px solid;
		padding: 0.25em 0.75em;
		border-radius: calc(var(--border-radius) - var(--outer-border-width));
		transition:
			transform var(--transition-duration),
			box-shadow var(--transition-duration);
	}

	button:hover:not(:disabled) {
		.inner {
			transform: translateY(-2px);
			box-shadow: var(--black) 0px 2px 0px;
		}
	}

	button:active:not(:disabled) {
		.inner {
			--transition-duration: 25ms;
			transform: translateY(1px);
			box-shadow: var(--black) 0px -1px 0px;
		}
	}

	button:disabled {
		pointer-events: none;

		.inner {
			background-color: var(--black);
			background-image: linear-gradient(90deg, var(--white) 0% 75%, transparent 76% 100%),
				linear-gradient(var(--white) 0% 75%, transparent 76% 100%);
			background-size: 4px 4px;
		}
	}
</style>
