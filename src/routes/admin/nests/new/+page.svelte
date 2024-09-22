<script lang="ts">
	import Sidebar from '$lib/components/admin/Sidebar.svelte';

	import Fa from 'svelte-fa';
	import {
		faGlobe,
		faPlus,
		faCircleExclamation,
		faCircleCheck
	} from '@fortawesome/free-solid-svg-icons';

	import { getCookie } from 'typescript-cookie';

	var name: string;
	var description: string;

	var error: string = '';
	var success: string = '';

	async function createNest() {
		error = '';
		success = '';

		if (!name) {
			return (error = 'Name is required');
		}

		if (!description) {
			return (error = 'Description is required');
		}

		try {
			const res = await fetch('/api/admin/nests', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${getCookie('token')}`
				},
				body: JSON.stringify({
					name,
					description
				})
			});

			if (!res.ok) {
				error = 'Failed to create nest';
			} else {
				success = 'Successfully created nest';
			}
		} catch {
			error = 'Failed to create nest';
		}
	}
</script>

<body class="flex flex-row">
	<Sidebar />
	<div class="glass flex-grow">
		<h1 class="text-2xl mb-2 font-bold">New Nest</h1>

		{#if error}
			<p class="text-red-500 mb-2 flex items-center text-lg">
				<Fa icon={faCircleExclamation} /> <span class="ml-1">{error}</span>
			</p>
		{/if}

		{#if success}
			<p class="text-green-500 mb-2 flex items-center text-lg">
				<Fa icon={faCircleCheck} /> <span class="ml-1">{success}</span>
			</p>
		{/if}

		<div class="flex flex-col">
			<label for="name">Name</label>
			<input type="text" id="name" name="name" placeholder="Cool Nest" bind:value={name} />

			<label for="description">Description</label>
			<input
				type="text"
				id="description"
				name="description"
				placeholder="A cool nest with many cool eggs"
				bind:value={description}
			/>

			<div class="flex">
				<button on:click={() => createNest()}>
					<Fa icon={faPlus} /> <span class="ml-1">Create Nest</span>
				</button>
			</div>
		</div>

		<p class="absolute top-4 right-4 text-sm">Admin > Nests > New</p>
	</div>
</body>

<style>
	input {
		padding: 0.5rem;
		margin: 0.5 0rem;
		border-radius: 0.375rem;

		/* From https://css.glass */
		background: rgba(10, 9, 9, 0.29);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(4.4px);
		-webkit-backdrop-filter: blur(4.4px);
		border: 1px solid rgba(10, 9, 9, 0.39);

		@apply placeholder-gray-500/80;
	}

	button {
		@apply bg-blue-500 p-2 rounded-md mt-4 mr-2 flex items-center transition-all duration-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:text-white/50;
	}

	label {
		margin: 0.5rem 0;
		font-weight: bold;
	}

	.checkbox {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>
