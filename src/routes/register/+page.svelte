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

	let email: string = '';
	let username: string = '';
	let password: string = '';
	let passwordConf: string = '';
	let error: string = '';

	const userRegex = /^[a-zA-Z0-9_]{3,16}$/;

	let session: Writable<DataSession> | null = null;

	session = getContext<Writable<DataSession>>('session');

	onMount(() => {
		session.subscribe((value) => {
			if (value?.authenticated) {
				window.location.href = '/';
			}
		});
	});

	async function register() {
		error = '';

		if (password !== passwordConf) {
			error = 'Passwords do not match.';
			return;
		}

		if (!userRegex.test(username)) {
			error =
				'Username must be between 3 and 16 characters and contain only letters, numbers, and underscores.';
			return;
		}

		try {
			const res = await fetch('/api/user/new', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, username, password })
			});

			const data = await res.json();

			if (res.status === 200) {
				session?.set({ authenticated: true, user: data });

				var s = data.session;
				var date = s.expires;

				setCookie('token', s.token, {
					expires: date
				});
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
		<form class="flex flex-col" on:submit={register}>
			<h1 class="text-3xl font-bold mx-auto">Register</h1>
			{#if error}
				<div class="flex flex-row">
					<Fa icon={faCircleExclamation} class="text-red-400 my-auto mr-1" />
					<p class="text-red-400 text-wrap break-words">{error}</p>
				</div>
			{/if}
			<label for="email">Email</label>
			<input
				class="placeholder-gray-500/50"
				type="email"
				name="email"
				placeholder="example@example.com"
				bind:value={email}
				required
			/>
			<label for="username">Username</label>
			<input
				class="placeholder-gray-500/50"
				type="text"
				name="username"
				placeholder="Enter your username"
				bind:value={username}
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
			<label for="confirm_password">Confirm Password</label>
			<input
				class="placeholder-gray-500/50"
				type="password"
				name="confirm_password"
				placeholder="∗∗∗∗∗∗∗∗∗∗∗∗"
				bind:value={passwordConf}
				required
			/>
			<p class=" my-2">
				Have an account? <a href="/login" class="text-blue-400">Login</a>
			</p>
			<button class="bg-blue-600 p-3 rounded-md">Register</button>
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
