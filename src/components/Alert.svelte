<script lang="ts">
	import { cn } from '../utils/cn';
	import { fly } from 'svelte/transition';

	export let type: 'success' | 'error' | 'warning' | 'info';
	export let title: string;
	const duration = 500;
</script>

<div
	class={cn(
		'absolute top-4 right-4 px-4 py-2 min-w-[100px] rounded-md font-medium text-white',
		type === 'success' && 'bg-success',
		type === 'error' && 'bg-error',
		type === 'warning' && 'bg-warning',
		type === 'info' && 'bg-info',
		!type && 'bg-info'
	)}
	transition:fly={{ delay: 300, y: -200, duration }}
>
	<div class="flex flex-row">
		<slot name="icon"></slot>
		<div>{title}</div>
	</div>
</div>
