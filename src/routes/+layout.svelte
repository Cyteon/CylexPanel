<script lang="ts">
	import '../app.css';
	import { getCookie, setCookie } from 'typescript-cookie';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import Maintenance from '$lib/components/Maintenance.svelte';

	import type { Data, DataSession } from '$lib/types/Data';
	import { type InstanceDocument } from '$lib/types/Instance';

	/** @type {import('./$types').LayoutData} */
	export let data: Data = { session: { authenticated: false, user: null } };

	const session = writable<DataSession>({
		authenticated: false,
		user: null
	});
	$: session.set(data.session);

	const instance = writable<InstanceDocument | null>(null);

	setContext('session', session);
	setContext('instance', instance);

	onMount(async () => {
		var token = getCookie('token');

		if (!token) {
			session.set({ authenticated: false, user: null });
		} else {
			const res = await fetch('/api/user/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token as string
				}
			});

			if (res.status === 200) {
				var data = await res.json();

				session.set({ authenticated: true, user: data.user });
			} else {
				session.set({ authenticated: false, user: null });
				setCookie('token', '', { expires: -1 });
				window.location.href = '/login';
			}
		}

		const res = fetch('/api');

		res.then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					instance.set(data.instance);
				});
			}
		});
	});
</script>

{#if $instance?.maintenance}
	<Maintenance />
{:else}
	<slot />
{/if}
