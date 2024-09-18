<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { DataSession } from '$lib/types/Data';

	import NavBar from '$lib/components/Navbar.svelte';

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
		<div class="card">
			<div class="flex flex-row">
				<h1>Server name</h1>
				<p class="ml-auto">0.0.0.0:1234</p>
			</div>
			<div>
				<p class="text-sm">Server description</p>
			</div>
		</div>
	</div></body
>

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
	}
</style>
