<script lang="ts">
	import { faker } from '@faker-js/faker';
	import { SalesInvoice } from '../../models/SalesInvoice.p';
	import { formatNumber } from '../../utils/number';
	import { cn } from '../../utils/cn';
	import { onDestroy } from 'svelte';
	import { useRealtimeList } from '../../hooks/useRealtimeList';

	const subscriber = useRealtimeList(SalesInvoice);
	let salesInvoices = [] as SalesInvoice[];
	const unsubscribe = subscriber.subscribe((value) => {
		salesInvoices = value;
	});

	onDestroy(() => {
		unsubscribe();
	});

	function getPaidColor(percentage: number) {
		if (percentage >= 50) {
			return 'bg-success';
		}
		if (percentage >= 20) {
			return 'bg-warning';
		}
		return 'bg-error';
	}

	async function createFakeInvoice(id?: string) {
		const taxRate = 7;
		const subtotalAmount = faker.number.float({ min: 1, max: 500, fractionDigits: 0 });
		let taxAmount = (subtotalAmount * taxRate) / 100;
		taxAmount = Math.round(taxAmount * 100) / 100;
		const totalAmount = subtotalAmount + taxAmount;

		const customerName = `${faker.person.firstName()} ${faker.person.lastName()}`;
		const invoice = (await SalesInvoice.find(id)) || new SalesInvoice();
		invoice.fill({
			customerName,
			subtotalAmount,
			taxRate,
			taxAmount,
			totalAmount,
			paidAmount: faker.number.float({ min: 0, max: totalAmount, fractionDigits: 0 })
		});
		await invoice.setRandomHexColor().save();
	}
</script>

<svelte:head>
	<title>Item List Example</title>
	<meta name="description" content="About this app" />
</svelte:head>

<main class="top-0 h-full w-full">
	<div>
		<div class="flex justify-end gap-4">
			<a
				href="/realtime/new"
				class="my-4 bg-svelte-500 hover:no-underline hover:bg-svelte-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
			>
				Add New
			</a>
			<button
				class="my-4 bg-svelte-500 hover:bg-svelte-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
				on:click={() => createFakeInvoice()}
			>
				Create Fake Data
			</button>
		</div>

		<div class="table-container">
			<table width="100%">
				<thead>
					<tr>
						<th width="5%" class="rounded-tl-md bg-svelte-500 text-white font-medium px-4 py-2"
						></th>
						<th width="30%" class="bg-svelte-500 text-white font-medium px-4 py-2">Customer Name</th
						>
						<th width="15%" class="bg-svelte-500 text-white font-medium px-4 py-2"
							><div class="text-right">Subtotal</div></th
						>
						<th width="10%" class="bg-svelte-500 text-white font-medium px-4 py-2"
							><div class="text-right">Tax</div></th
						>
						<th width="15%" class="bg-svelte-500 text-white font-medium px-4 py-2"
							><div class="text-right">Total</div></th
						>
						<th width="20%" class="rounded-tr-md bg-svelte-500 text-white font-medium px-4 py-2"
							><div class="text-right">Paid Amount</div></th
						>
					</tr>
				</thead>
			</table>

			<div class="table-body border-slate-300 rounded-bl-md rounded-br-md border mt-[-2px]">
				<table width="100%">
					<tbody>
						{#each salesInvoices as invoice}
							<tr
								class="bg-transparent hover:bg-gray-200 text-gray-800 border-b border-slate-300 cursor-pointer"
								on:click={() => {
									createFakeInvoice(invoice.id);
									// window.location.href = `/realtime/${invoice.id}`;
								}}
							>
								<td width="5%" class="pt-4 px-4 py-2">
									<div style="background-color: {invoice.color}" class="w-4 h-4 rounded-full"></div>
								</td>
								<td width="30%" class="px-4 py-2">{invoice.customerName}</td>
								<td width="15%" class="px-4 py-2">
									<div class="text-right">
										{formatNumber(invoice.subtotalAmount)}
									</div>
								</td>
								<td width="10%" class="px-4 py-2">
									<div class="text-right">
										{formatNumber(invoice.taxAmount)}
									</div>
								</td>
								<td width="15%" class="px-4 py-2">
									<div class="text-right">
										{formatNumber(invoice.totalAmount)}
									</div>
								</td>
								<td width="20%" class="py-2">
									<div class={cn('h-1 rounded-full bg-gray-300 mt-[-12px]')}>
										<div
											class={cn('h-1 rounded-full', getPaidColor(invoice.paidPercentage))}
											style="width: {invoice.paidPercentage}%"
										></div>
										<div class="text-right">{formatNumber(invoice.paidAmount)}</div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{#if salesInvoices.length === 0}
					<div class="flex items-center justify-center h-full">
						<div class="text-svelte-500">
							No data available, click the button above to add fake data
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	.table-container {
		position: relative;
		width: 100%;
	}

	.table-container thead {
		position: sticky;
		top: 0;
		z-index: 10;
		/* Ensure header stays on top */
	}

	.table-body {
		height: 50vh;
		/* Adjust the height to your needs */
		overflow-y: auto;
	}

	@media (min-width: 1024px) {
		.table-container {
			position: relative;
			width: 100%;
		}

		.table-body {
			height: 70vh;
			/* Adjust the height to your needs */
			overflow-y: auto;
		}
	}

	.table-body table {
		width: 100%;
		border-collapse: collapse;
	}

	/* Optional: Keep the column widths consistent between header and body */
	th,
	td {
		text-align: left;
		padding: 8px;
	}
</style>
