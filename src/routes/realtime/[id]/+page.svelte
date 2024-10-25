<script lang="ts">
	import { onMount } from 'svelte';
	import { SalesInvoice } from '../../../models/SalesInvoice.p';
	import { useRealtime } from '../../../hooks/useRealtime';
	import type { PageData } from './$types';

	export let data: PageData;
	const subscriber = useRealtime(SalesInvoice, data.id);

	onMount(() => {
		console.log('data: ', data);
	});
</script>

<svelte:head>
	<title>Item Example</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>item</div>
