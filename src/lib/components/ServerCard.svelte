<script lang="ts">
	export let name: string;
	export let description: string;
	export let ip: string;
	export let port: number;
	export let cpu: string;
	export let ram: string;
	export let disk: string;
	export let node: string;
	export let status: string;
	export let id: string;

	import Fa from 'svelte-fa';
	import { faMicrochip, faMemory, faHardDrive } from '@fortawesome/free-solid-svg-icons';
</script>

<a href={'/server/' + id} class="card">
	<div class="flex flex-row">
		<h1>{name}</h1>
		<aside class="absolute right-4 top-4 text-end">
			<p>{`${ip}:${port}`}</p>
			<p class="text-sm">{node}</p>
		</aside>
	</div>
	<div>
		<p class="text-sm">{description}</p>
	</div>
	<div class="resources mt-auto">
		<p><Fa icon={faMicrochip} /> <span>{cpu}</span></p>
		<p><Fa icon={faMemory} /> <span>{ram}</span></p>
		<p><Fa icon={faHardDrive} /> <span>{disk}</span></p>
	</div>
	<div class="absolute bottom-4 right-4">
		{#if status == 'online'}
			<div class="bg-green-500 text-white rounded-full p-2" />
		{:else if status == 'starting'}
			<div class="bg-yellow-500 text-white rounded-full p-2" />
		{:else}
			<div class="bg-red-500 text-white rounded-full p-2" />
		{/if}
	</div>
</a>

<style>
	.card {
		padding: 1rem;
		margin: 0.5 0rem;
		width: 300px;
		height: 150px;
		border-radius: 0.4rem;

		/* From https://css.glass */
		background: rgba(10, 9, 9, 0.29);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(4.4px);
		-webkit-backdrop-filter: blur(4.4px);
		border: 1px solid rgba(10, 9, 9, 0.39);

		display: flex;
		flex-direction: column;
	}

	.resources p {
		display: flex;
		align-items: center;
	}

	.resources p span {
		margin-left: 0.5rem;
	}
</style>
