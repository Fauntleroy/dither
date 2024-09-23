<script lang="ts">
	import { Select } from 'bits-ui';
	import { onMount } from 'svelte';

	import Button from './button.svelte';
	import CaretLeftIcon from '$/icons/caret-left.svelte';
	import SelectArrowsIcon from '$/icons/select-arrows.svelte';

	interface SelectOptionT {
		value: any;
		label: string;
		children?: any;
		style?: string;
	}

	interface PropsT {
		name: string;
		placeholder: string;
		options: SelectOptionT[];
		prefix?: any;
		onSelectedChange: (value: unknown | undefined) => void;
		selected: any;
		disabled?: boolean;
	}

	let { name, options, prefix, onSelectedChange, placeholder, selected, disabled }: PropsT =
		$props();

	let fontSize: string = $state('1em');
	let selectArrowsElement: HTMLElement; // Reference to the element you want to check

	onMount(() => {
		fontSize = window.getComputedStyle(selectArrowsElement).fontSize;
	});
</script>

<Select.Root items={options} portal="#content" {onSelectedChange} {selected} {disabled}>
	<Select.Trigger aria-label={placeholder} asChild let:builder>
		<Button builders={[builder]}>
			<div class="trigger">
				{#if prefix}{prefix}{/if}
				<strong><Select.Value class="text" {placeholder} /></strong>
				<span class="select-arrows" bind:this={selectArrowsElement}><SelectArrowsIcon /></span>
			</div>
		</Button>
	</Select.Trigger>
	<Select.Content strategy="fixed" sameWidth={false} asChild let:builder>
		<div class="content" use:builder.action {...builder}>
			{#each options as option}
				<Select.Item value={option.value} label={option.label} asChild let:builder>
					<div
						class="item"
						style={`font-size: ${fontSize}; ${option.style}`}
						use:builder.action
						{...builder}
					>
						{option.children || option.label}
						<Select.ItemIndicator class="item-indicator" asChild>
							<span class="item-indicator">
								<CaretLeftIcon />
							</span>
						</Select.ItemIndicator>
					</div>
				</Select.Item>
			{/each}
		</div>
	</Select.Content>
	<Select.Input {name} />
</Select.Root>

<style>
	.trigger {
		display: flex;
		gap: 0.5em;
		margin-right: -0.25em;
	}

	.select-arrows {
		display: inline-block;
		width: 1em;
		height: 1em;
	}

	.content {
		z-index: 9999;
		position: relative;
		background: var(--white);
		color: var(--black);
		border-radius: 0.5em;
		border: var(--black) 1px dotted;
		padding: 2px;
	}

	.item {
		display: flex;
		gap: 1em;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.25em 1em;
		border-radius: 0.5em;
	}

	.item-indicator {
		width: 1em;
		height: 1em;
		display: none;
	}

	:global([data-highlighted]) {
		cursor: pointer;
		background: var(--black);
		color: var(--white);
	}

	:global([data-selected]) {
		.item-indicator {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
