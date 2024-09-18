<script lang="ts">
	import { onMount } from 'svelte';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let error = '';

	var instanceName = '';
	var enableRegistration = false;

	var email = '';
	var username = '';
	var password = '';
	var passwordConf = '';

	let step: number = 0;

	onMount(async () => {
		const res = await fetch('/api/admin/setup/ready', {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// 200 == Server ready for setup
		if (res.status !== 200) {
			window.location.href = '/';
		}
	});

	async function finish() {
		error = '';

		if (password !== passwordConf) {
			error = 'Passwords do not match.';
			return;
		}

		const res = await fetch('/api/admin/setup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ instanceName, enableRegistration, email, username, password })
		});

		const data = await res.json();

		if (res.status === 200) {
			window.location.href = '/';
		} else {
			error = data.error;
		}
	}
</script>

<body class="w-full h-screen flex">
	<div class="m-auto">
		{#if step == 0}
			<form class="flex flex-col">
				<h1 class="text-3xl font-bold mx-auto">Set instance settings</h1>
				{#if error}
					<div class="flex flex-row">
						<Fa icon={faCircleExclamation} class="text-red-400 my-auto mr-1" />
						<p class="text-red-400">{error}</p>
					</div>
				{/if}
				<label for="instanceName">Instance Name</label>
				<input type="text" id="instanceName" placeholder="CylexPanel" bind:value={instanceName} />
				<label for="enableRegistration">Enable Registration</label>
				<input
					type="checkbox"
					id="enableRegistration"
					class="w-fit checkbox switch"
					bind:checked={enableRegistration}
				/>
				<button class="bg-blue-600 p-3 rounded-md mt-3" on:click={() => (step += 1)}>Next</button>
			</form>
		{/if}
		{#if step == 1}
			<form class="flex flex-col" on:submit={finish}>
				<h1 class="text-3xl font-bold mx-auto">Make the first account</h1>
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
				<button class="bg-blue-600 p-3 rounded-md mt-2">Finish setup</button>
			</form>
		{/if}
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

	.checkbox {
		width: 1.5rem;
		height: 1.5rem;
	}

	label {
		margin: 0.3rem 0;
	}
</style>
