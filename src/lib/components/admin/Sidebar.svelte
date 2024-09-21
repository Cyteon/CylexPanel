<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { InstanceDocument } from '$lib/types/Instance';
	import type { DataSession } from '$lib/types/Data';

	import Fa from 'svelte-fa';
	import {
		faWrench,
		faNetworkWired,
		faServer,
		faUser,
		faPersonRunning
	} from '@fortawesome/free-solid-svg-icons';

	let instance: Writable<InstanceDocument> | null = null;
	let session: Writable<DataSession> | null = null;

	instance = getContext<Writable<InstanceDocument>>('instance');
	session = getContext<Writable<DataSession>>('session');
</script>

<nav class="flex flex-col">
	<h1 class="text-3xl font-bold mx-auto">{$instance?.name}</h1>

	<hr />

	<a href="/admin/settings" class="link"> <Fa icon={faWrench} /> <span>Settings</span> </a>

	<hr />

	<a href="/admin/nodes" class="link"> <Fa icon={faNetworkWired} /> <span>Nodes</span> </a>
	<a href="/admin/servers" class="link"> <Fa icon={faServer} /> <span>Servers</span> </a>
	<a href="/admin/users" class="link"> <Fa icon={faUser} /> <span>Users</span> </a>

	<div class="mt-auto">
		<hr />
		<a href="/" class="link"> <Fa icon={faPersonRunning} /> <span>Exit</span> </a>
	</div>
</nav>

<style>
	nav {
		/* From https://css.glass */
		background: rgba(30, 30, 30, 0.3);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5.6px);
		-webkit-backdrop-filter: blur(5.6px);
		border: 1px solid rgba(30, 30, 30, 0.3);

		padding: 0.5rem;
		margin: 0.5rem;
		border-radius: 0.4rem;
	}

	hr {
		border: 0;
		margin: 0.5rem 0;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
	}

	.link span {
		text-align: center;
		width: 100%;
	}

	.link {
		display: flex;
		align-items: center;
		transition: all 0.4s;
		padding: 0.5rem;
	}

	.link:hover {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0.4rem;
	}

	.link span {
		margin-left: 0.5rem;
	}
</style>
