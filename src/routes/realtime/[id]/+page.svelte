<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SalesInvoice } from '../../../models/SalesInvoice.p';
	import type { PageData } from './$types';
	import { cn } from '../../../utils/cn';
	import { formatNumber } from '../../../utils/number';
	import BackButton from '../../../components/BackButton.svelte';
	import Alert from '../../../components/Alert.svelte';
	import { CheckCircle, InfoIcon } from 'lucide-svelte';
	import { useRealtime } from 'pocketto-svelte';

	let invoice: SalesInvoice;
	let rev: string;
	let saved: boolean = false;
	let beingUpdated: boolean = false;
	export let data: PageData;
	const subscriber = useRealtime(SalesInvoice, data.id);
	const unsubscribe = subscriber.subscribe((value) => {
		invoice = value;
		if (invoice.rev !== rev && rev && invoice.rev && !saved) {
			beingUpdated = true;
			setTimeout(() => (beingUpdated = false), 3000);
		}
		rev = value.rev;
	});
	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Demo Real Time Item</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	{#if saved}
		<Alert type="success" title="Invoice is saved!">
			<CheckCircle class="w-5 h-5 inline-block mr-2 mt-0.5" slot="icon"></CheckCircle>
		</Alert>
	{/if}
	{#if beingUpdated}
		<Alert type="info" title="Invoice has been updated">
			<InfoIcon class="w-5 h-5 inline-block mr-2 mt-0.5" slot="icon"></InfoIcon>
		</Alert>
	{/if}
	<div class="flex justify-between">
		<div class="text-2xl font-semibold">{data.id ? 'Update invoice' : 'Create new invoice'}</div>
		<div class="flex flex-row gap-4">
			<BackButton />
			<button
				class="my-4 bg-svelte-500 hover:bg-svelte-700 text-white active:scale-90 font-medium py-2 px-4 rounded"
				on:click={async () => {
					await invoice.save();
					saved = true;
					setTimeout(() => (saved = false), 3000);
				}}
			>
				Save
			</button>
		</div>
	</div>
	<div class="flex flex-row gap-6">
		<div class="mt-4 w-[5%]">
			<div class="font-medium text-sm text-slate-500">Color</div>
			<button
				class={cn(
					'w-8 h-8 mt-2 mx-1 rounded-full cursor-pointer',
					!invoice.color && 'border border-slate-300'
				)}
				style="background-color: {invoice.color};"
				on:click={() => {
					invoice = invoice.setRandomHexColor();
				}}
				aria-label="Set random hex color"
			></button>
		</div>
		<div class="mt-4 w-[95%]">
			<div class="font-medium text-sm text-slate-500">Customer Name</div>
			<input
				class="border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full"
				bind:value={invoice.customerName}
			/>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<div class="mt-4 w-1/2">
			<div class="font-medium text-sm text-slate-500">Subtotal Amount</div>
			<input
				class="border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full"
				type="number"
				bind:value={invoice.subtotalAmount}
				on:input={(event) => {
					const value = parseFloat(event.target?.value || '');
					invoice.taxAmount = (value * invoice.taxRate) / 100;
					const totalAmount = Number(value) + Number(invoice.taxAmount);
					invoice.totalAmount = totalAmount;
				}}
			/>
		</div>
		<div class="mt-4 w-1/2">
			<div class="font-medium text-sm text-slate-500">Tax Rate (%)</div>
			<input
				class="border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full"
				type="number"
				bind:value={invoice.taxRate}
				on:input={(event) => {
					const value = parseFloat(event.target?.value || '');
					invoice.taxAmount = (invoice.subtotalAmount * value) / 100;
					const totalAmount = Number(invoice.subtotalAmount) + Number(invoice.taxAmount);
					invoice.totalAmount = totalAmount;
				}}
			/>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<div class="mt-4 w-1/2">
			<div class="font-medium text-sm text-slate-500">Tax Amount</div>
			<input
				class="border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full disabled:opacity-50"
				disabled
				value={formatNumber(invoice.taxAmount || 0)}
			/>
		</div>
		<div class="mt-4 w-1/2">
			<div class="font-medium text-sm text-slate-500">Grant Total Amount</div>
			<input
				class="border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full disabled:opacity-50"
				disabled
				value={formatNumber(invoice.totalAmount || 0)}
			/>
		</div>
	</div>
	<div class="mt-4 w-full">
		<div class="font-medium text-sm text-slate-500">Paid Amount</div>
		<input
			class={cn(
				'border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full',
				Number(invoice.paidAmount) > Number(invoice.totalAmount) &&
					'border-error focus:outline-error'
			)}
			type="number"
			bind:value={invoice.paidAmount}
		/>
		{#if Number(invoice.paidAmount) > Number(invoice.totalAmount)}
			<div class="text-xs text-error">Paid amount should be less than total amount</div>
		{/if}
		{#if Number(invoice.paidAmount) === Number(invoice.totalAmount)}
			<div class="text-xs text-success">All cleared!</div>
		{/if}
	</div>
</div>
