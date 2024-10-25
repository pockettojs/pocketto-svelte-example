<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SalesInvoice } from '../../../models/SalesInvoice.p';
	import { useRealtime } from '../../../hooks/useRealtime';
	import type { PageData } from './$types';
	import { cn } from '../../../utils/cn';
	import { formatNumber } from '../../../utils/number';

	let invoice: SalesInvoice;
	export let data: PageData;
	const subscriber = useRealtime(SalesInvoice, data.id);
	const unsubscribe = subscriber.subscribe((value) => {
		invoice = value;
	});
	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Item Example</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<div class="flex justify-between">
		<div class="text-2xl font-semibold">{data.id ? 'Update invoice' : 'Create new invoice'}</div>
		<div class="flex flex-row gap-4">
			<button
				class="my-4 bg-svelte-500 hover:bg-svelte-700 text-white active:scale-90 font-medium py-2 px-4 rounded"
				on:click={() => invoice.save()}
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
				on:input={(event) => (invoice.customerName = event.target?.value)}
				value={invoice.customerName}
			/>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<div class="mt-4 w-1/2">
			<div class="font-medium text-sm text-slate-500">Subtotal Amount</div>
			<input
				class="border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full"
				value={invoice.subtotalAmount}
				on:input={(event) => {
					const value = parseFloat(event.target?.value || '');
					invoice.taxAmount = (value * invoice.taxRate) / 100;
					const totalAmount = Number(value) + Number(invoice.taxAmount);
					invoice.totalAmount = totalAmount;
					invoice.subtotalAmount = event.target?.value;
				}}
			/>
		</div>
		<div class="mt-4 w-1/2">
			<div class="font-medium text-sm text-slate-500">Tax Rate (%)</div>
			<input
				class="border border-slate-400 rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full"
				value={invoice.taxRate}
				on:input={(event) => {
					const value = parseFloat(event.target?.value || '');
					invoice.taxAmount = (invoice.subtotalAmount * value) / 100;
					const totalAmount = Number(invoice.subtotalAmount) + Number(invoice.taxAmount);
					invoice.totalAmount = totalAmount;
					invoice.taxRate = event.target?.value;
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
			on:input={(event) => {
				invoice.paidAmount = event.target?.value;
			}}
			value={invoice.paidAmount}
		/>
		{#if Number(invoice.paidAmount) > Number(invoice.totalAmount)}
			<div class="text-xs text-error">Paid amount should be less than total amount</div>
		{/if}
		{#if Number(invoice.paidAmount) === Number(invoice.totalAmount)}
			<div class="text-xs text-success">All cleared!</div>
		{/if}
	</div>
</div>
