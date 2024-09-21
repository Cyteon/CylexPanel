<script lang="ts">
	import Sidebar from '$lib/components/admin/Sidebar.svelte';

	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		type ColumnDef
	} from '@tanstack/svelte-table';
	import { onMount } from 'svelte';
	import type { ServerDocument } from '$lib/types/Node';
	import { getCookie } from 'typescript-cookie';

	import Fa from 'svelte-fa';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';

	const columns: ColumnDef<ServerDocument>[] = [
		{
			header: 'ID',
			accessorKey: '_id'
		},
		{
			header: 'Name',
			accessorKey: 'name'
		},
		{
			header: 'Node',
			accessorKey: 'node'
		},
		{
			header: 'Egg',
			accessorKey: 'egg'
		}
	];

	var nodes: ServerDocument[] = [];

	let table = createSvelteTable({
		columns: columns,
		data: nodes,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	onMount(async () => {
		const res = await fetch('/api/admin/servers', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${getCookie('token')}`
			}
		});
		const data = await res.json();

		if (res.ok) {
			nodes = data.nodes;

			table = createSvelteTable({
				columns: columns,
				data: nodes,
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
		<h1 class="text-2xl mb-4 font-bold">Servers</h1>
		{#if nodes.length > 0}
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
			<p>No servers found.</p>
		{/if}
		<button class="bg-blue-500 p-2 rounded-md mt-4 transition-all duration-500 hover:bg-blue-600">
			<a href="/admin/servers/new" class="flex items-center">
				<Fa icon={faPlus} /> <span class="ml-1">Create Server</span>
			</a>
		</button>
		<p class="absolute top-4 right-4 text-sm">Admin > Servers</p>
	</div>
</body>
