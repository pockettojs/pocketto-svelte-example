<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from '../utils/cn';
	import { fade } from 'svelte/transition';

	export let start = false;
	export let color = '#00ff00';
	export let className = '';

	const dispatch = createEventDispatcher();

	let showElse = true;

	$: if (!start) {
		setTimeout(() => {
			showElse = true;
		}, 450);
	} else {
		showElse = false;
	}
</script>

{#if start}
	<tr
		class={cn(`h-full w-full cursor-pointer`, className)}
		on:click={(event) => dispatch('click', event)}
		style="background-color: {color};"
		transition:fade={{ duration: 450 }}
	>
		<slot />
	</tr>
{:else if showElse}
	<tr
		class={cn(`h-full w-full cursor-pointer`, className)}
		on:click={(event) => dispatch('click', event)}
	>
		<slot />
	</tr>
{/if}

<style>
	tr {
		transition: background-color 0.5s ease;
	}
</style>
