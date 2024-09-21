<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { InstanceDocument } from '$lib/types/Instance';
	import type { DataSession } from '$lib/types/Data';
	import Fa from 'svelte-fa';
	import { faServer, faHammer, faUser } from '@fortawesome/free-solid-svg-icons';

	let instance: Writable<InstanceDocument> | null = null;
	let session: Writable<DataSession> | null = null;

	instance = getContext<Writable<InstanceDocument>>('instance');
	session = getContext<Writable<DataSession>>('session');
</script>

<nav class="flex flex-row glass">
	<h1 class="text-3xl font-bold my-auto">{$instance?.name}</h1>

	<div class="my-auto ml-auto flex flex-row">
		<a href="/">
			<div class="icon">
				<Fa icon={faServer} />
			</div>
		</a>
		{#if $session?.user?.admin}
			<a href="/admin">
				<div class="icon">
					<Fa icon={faHammer} />
				</div>
			</a>
		{/if}
		<a href="/account">
			<div class="icon">
				<Fa icon={faUser} />
			</div>
		</a>
	</div>
</nav>

<style>
	nav {
		padding: 0.5rem;
		margin: 0.5rem;
		border-radius: 0.4rem;
	}

	.icon {
		transition: all 0.4s;
		font-size: 2rem;
		padding: 0.5rem;
		border-radius: 0.4rem;
		margin: 0 0.2rem;
	}

	.icon:hover {
		background: rgba(0, 0, 0, 0.2);
	}
</style>
