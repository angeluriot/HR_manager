<script lang="ts">

	import * as Server from '../shared/server.js';
	import Global from '../shared/Global.js';
	import * as Cookie from '../shared/cookie.js';
	import { onMount } from "svelte";

	let unique = {};

	function restart()
	{
		unique = {}
	}

	onMount(() =>
	{
		if (Global.user)
			window.location.href = "#/";
	});

	let email = '';
	let password = '';
	let error = '';

	async function onClick()
	{
		if (email.trim() === '' || password.trim() === '')
		{
			error = "Email or password is empty";
			return;
		}

		try
		{
			var connection_data = await Server.login(email.trim(), password.trim());
		}

		catch (err: any)
		{
			error = err.message;
			return;
		}

		Global.user = connection_data.user_data;
		Cookie.save_token(connection_data.token, connection_data.expires);
		window.location.href = "#/";
	}

</script>

{#key unique}
	<div class="main gap-10">
		<h1>Login</h1>
		<div class="flex flex-col">
			<label for="email">Email</label>
			<input type="email" id="email" class="mb-6" bind:value={email}/>
			<label for="password">Password</label>
			<input type="password" id="password" class="mb-6" bind:value={password} />
			<span class="text-red-500 mb-6">{error}</span>
			<button on:click={onClick} class="bg-blue-500 text-white p-2 rounded">Login</button>
		</div>
	</div>
{/key}

<style>
</style>
