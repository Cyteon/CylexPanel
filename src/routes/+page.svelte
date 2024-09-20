<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { DataSession } from '$lib/types/Data';

	import NavBar from '$lib/components/Navbar.svelte';
	import ServerCard from '$lib/components/ServerCard.svelte';

	let session: Writable<DataSession> | null = null;

	session = getContext<Writable<DataSession>>('session');

	onMount(() => {
		session.subscribe((value) => {
			console.log(value);
			if (value && !value.authenticated) {
				window.location.href = '/login';
			}
		});
	});
</script>

<body>
	<NavBar />
	<div class="glass flex-grow">
		<ServerCard
			name="Server name"
			id="server-id"
			ip="0.0.0.0"
			port={1234}
			description="Server description"
			cpu="100%/200%"
			ram="80% (8GB/10GB)"
			disk="5GB/10GB"
			node="EU-1"
			status="online"
		/>
	</div>
</body>

<style>
	body {
		background-image: url('/static/bg.jpg');
		background-size: cover;
		color: white;

		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.glass {
		/* From https://css.glass */
		background: rgba(30, 30, 30, 0.3);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5.6px);
		-webkit-backdrop-filter: blur(5.6px);
		border: 1px solid rgba(30, 30, 30, 0.3);

		padding: 1rem;
		margin: 0.5rem;
		border-radius: 0.4rem;
	}
</style>
