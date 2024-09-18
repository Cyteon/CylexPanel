<script lang="ts">
	import { type Data } from '$lib/types/Data';
	import Fa from 'svelte-fa';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { DataSession } from '$lib/types/Data';
	import { setCookie } from 'typescript-cookie';

	/** @type {import('./$types').LayoutData} */
	export let data: Data;

	let identifier: string = '';
	let password: string = '';
	let error: string = '';

	let session: Writable<DataSession> | null = null;

	session = getContext<Writable<DataSession>>('session');

	onMount(() => {
		session.subscribe((value) => {
			console.log(value);
			if (value?.authenticated) {
				window.location.href = '/';
			}
		});
	});

	async function login() {
		error = '';

		try {
			const res = await fetch('/api/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ identifier, password })
			});

			const data = await res.json();

			if (res.status === 200) {
				var s = data.session;
				var date = new Date(s.expires);

				setCookie('token', s.token, {
					expires: date
				});

				session?.set({ authenticated: true, user: data });
			} else {
				error = data.message;
			}
		} catch {
			error = 'An unexpected error occurred.';
		}
	}
</script>

<body class="w-full h-screen flex">
	<div class="m-auto">
		<form class="flex flex-col" on:submit={login}>
			<h1 class="text-3xl font-bold mx-auto">Login</h1>
			{#if error}
				<div class="flex flex-row">
					<Fa icon={faCircleExclamation} class="text-red-400 my-auto mr-1" />
					<p class="text-red-400">{error}</p>
				</div>
			{/if}
			<label for="identifier">Username or Email</label>
			<input
				class="placeholder-gray-500/50"
				type="text"
				name="identifier"
				placeholder="Enter your username or email"
				bind:value={identifier}
				required
			/>
			<label for="password">Password</label>
			<input
				class="placeholder-gray-500/50"
				type="password"
				name="password"
				placeholder="∗∗∗∗∗∗∗∗∗∗∗∗"
				bind:value={password}
				required
			/>
			<p class=" my-2">
				Don't have an account? <a href="/register" class="text-blue-400">Register</a>
			</p>
			<button class="bg-blue-600 p-3 rounded-md">Login</button>
		</form>
	</div>
</body>

<style>
	body {
		background-image: url('/static/bg.jpg');
		background-size: cover;
		color: white;
	}

	form {
		font-size: 1.3rem;
		/* From https://css.glass */
		background: rgba(30, 30, 30, 0.3);
		border-radius: 16px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5.6px);
		-webkit-backdrop-filter: blur(5.6px);
		border: 1px solid rgba(30, 30, 30, 0.3);

		padding: 1rem;
		border-radius: 0.5rem;

		max-width: 400px;
	}

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
	}

	label {
		margin: 0.3rem 0;
	}
</style>
