<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLButtonAttributes } from 'svelte/elements';
	import { builderActions, getAttrs, type Builder } from 'bits-ui';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
		variant?: 'normal' | 'inverted';
		// bits-ui
		builders?: Builder[];
	}

	const { children, variant = 'normal', builders = [], ...restProps }: Props = $props();
</script>

<button
	{...restProps}
	class:invert={variant === 'inverted'}
	use:builderActions={{ builders }}
	{...getAttrs(builders)}
>
	<div class="inner">{@render children()}</div>
</button>

<style>
	button {
		--background-color: var(--white);
		--foreground-color: var(--black);
		--border-radius: 0.5em;
		--outer-border-width: 3px;
		--transition-duration: 150ms;
		background: var(--background-color);
		color: var(--foreground-color);
		padding: var(--outer-border-width);
		border-radius: var(--border-radius);
		border: var(--foreground-color) 1px dotted;
	}

	.inner {
		border: var(--foreground-color) 1px solid;
		padding: 0.25em 0.75em;
		border-radius: calc(var(--border-radius) - var(--outer-border-width));
		transition:
			transform var(--transition-duration),
			box-shadow var(--transition-duration);
	}

	button:hover:not(:disabled) {
		.inner {
			transform: translateY(-3px);
			box-shadow: var(--foreground-color) 0px 3px 0px;
		}
	}

	button:active:not(:disabled) {
		.inner {
			--transition-duration: 25ms;
			transform: translateY(1px);
			box-shadow: var(--foreground-color) 0px -1px 0px;
		}
	}

	button:disabled {
		pointer-events: none;

		.inner {
			background-color: var(--foreground-color);
			background-image: linear-gradient(90deg, var(--background-color) 0% 75%, transparent 76% 100%),
				linear-gradient(var(--white) 0% 75%, transparent 76% 100%);
			background-size: 4px 4px;
		}
	}

	.invert {
		--background-color: var(--black);
		--foreground-color: var(--white);
	}
</style>
