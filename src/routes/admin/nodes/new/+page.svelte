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
	var location: string;
	var fqdn: string;
	var port: number = 8080;
	var secure: boolean = false;

	var error: string = '';
	var success: string = '';

	async function testConnection() {
		error = '';
		success = '';

		if (!fqdn) {
			return (error = 'FQDN is required');
		}

		if (!port) {
			return (error = 'Port is required');
		}

		try {
			const res = await fetch(`${secure ? 'https' : 'http'}://${fqdn}:${port}/api/`, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				const addButton = document.getElementById('add');

				if (addButton) {
					addButton.disabled = true;
				}

				error = `Failed to connect to ${fqdn}:${port}`;
			} else {
				const addButton = document.getElementById('add');

				if (addButton) {
					addButton.disabled = false;
				}

				success = `Successfully connected to ${fqdn}:${port}`;
			}
		} catch {
			error = `Failed to connect to ${fqdn}:${port}`;

			const addButton = document.getElementById('add');

			if (addButton) {
				addButton.disabled = true;
			}
		}
	}

	async function addNode() {
		error = '';
		success = '';

		if (!name) {
			return (error = 'Name is required');
		}

		if (!location) {
			return (error = 'Location is required');
		}

		if (!fqdn) {
			return (error = 'FQDN is required');
		}

		if (!port) {
			return (error = 'Port is required');
		}

		const res = await fetch('/api/admin/nodes', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${getCookie('token')}`
			},
			body: JSON.stringify({
				name,
				location,
				fqdn,
				port,
				secure
			})
		});

		const body = await res.json();

		if (res.ok) {
			success = body.message;
		} else {
			error = body.message || res.statusText;
		}
	}
</script>

<body class="flex flex-row">
	<Sidebar />
	<div class="glass flex-grow">
		<h1 class="text-2xl mb-2 font-bold">New Node</h1>

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
			<input type="text" id="name" name="name" placeholder="Cool Node" bind:value={name} />

			<label for="location">Location</label>
			<input type="text" id="location" name="location" placeholder="US" bind:value={location} />

			<label for="fqdn">FQDN</label>
			<input type="text" id="fqdn" name="fqdn" placeholder="node.example.com" bind:value={fqdn} />

			<label for="fqdn">Port</label>
			<input type="number" id="port" name="port" bind:value={port} />

			<label for="secure">Use HTTPS</label>
			<input type="checkbox" class="checkbox" id="secure" name="secure" bind:checked={secure} />

			<div class="flex">
				<button on:click={() => testConnection()}>
					<Fa icon={faGlobe} /> <span class="ml-1">Test Connection</span>
				</button>
				<button id="add" on:click={() => addNode()} disabled>
					<Fa icon={faPlus} /> <span class="ml-1">Add Node</span>
				</button>
			</div>
		</div>

		<p class="absolute top-4 right-4">Admin > Nodes > New</p>
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
