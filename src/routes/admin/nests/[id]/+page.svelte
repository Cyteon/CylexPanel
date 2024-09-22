<script lang="ts">
	export let data: { id: string };

	import Sidebar from '$lib/components/admin/Sidebar.svelte';

	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		type ColumnDef
	} from '@tanstack/svelte-table';
	import { onMount } from 'svelte';
	import type { EggDocument } from '$lib/types/Egg';
	import { getCookie } from 'typescript-cookie';

	import Fa from 'svelte-fa';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';

	let nest: { name: string; description: string };

	const columns: ColumnDef<EggDocument>[] = [
		{
			header: 'ID',
			accessorKey: '_id'
		},
		{
			header: 'Name',
			accessorKey: 'name'
		},
		{
			header: 'Description',
			accessorKey: 'description'
		}
	];

	var eggs: EggDocument[] = [];

	let table = createSvelteTable({
		columns: columns,
		data: eggs,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	onMount(async () => {
		const res = await fetch('/api/admin/nests/' + data.id, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${getCookie('token')}`
			}
		});
		const body = await res.json();

		if (res.ok) {
			eggs = body.eggs;
			nest = body.nest;

			table = createSvelteTable({
				columns: columns,
				data: eggs,
				getCoreRowModel: getCoreRowModel(),
				getSortedRowModel: getSortedRowModel()
			});
		} else {
			console.log(res.status);
			window.location.href = '/';
		}
	});
</script>

<body class="flex flex-row">
	<Sidebar />
	<div class="glass flex-grow">
		<h1 class="text-2xl font-bold">Nest: {nest?.name}</h1>
		<p class="mb-4">{nest?.description}</p>
		{#if eggs.length > 0}
			<table class="table w-full">
				<thead>
					{#each $table.getHeaderGroups() as headerGroup}
						<tr>
							{#each headerGroup.headers as header}
								<th colspan={header.colSpan} class="text-start">
									{#if !header.isPlaceholder}
										<svelte:component
											this={flexRender(header.column.columnDef.header, header.getContext())}
										/>
									{/if}
								</th>
							{/each}
						</tr>
					{/each}
				</thead>

				<tbody>
					{#each $table.getRowModel().rows as row}
						<tr class="border-t-2 border-t-black/40 flex-grow">
							{#each row.getVisibleCells() as cell}
								<td>
									<svelte:component
										this={flexRender(cell.column.columnDef.cell, cell.getContext())}
									/>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>No eggs found.</p>
		{/if}
		<button class="bg-blue-500 p-2 rounded-md mt-5 transition-all duration-500 hover:bg-blue-600">
			<a href={`/admin/nests/${data.id}/new`} class="flex items-center">
				<Fa icon={faPlus} /> <span class="ml-1">Add Egg</span>
			</a>
		</button>
		<p class="absolute top-4 right-4 text-sm">Admin > Nests > {data.id}</p>
	</div>
</body>
