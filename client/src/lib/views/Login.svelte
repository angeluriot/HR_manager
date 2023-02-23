<script lang="ts">

	import * as Server from '../shared/server.js';
	import Global from '../shared/Global.js';
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
			await Server.login(email.trim(), password.trim());
		}

		catch (err: any)
		{
			error = err.message;
			return;
		}
	}

</script>

{#key unique}
	<div class="flex flex-col justify-center items-center w-full h-full gap-12">
		<h1 class="mb-16">Connexion</h1>

		<div class="input-container enabled flex relative">
			<input type="text" bind:value={email}/>
			<span>E-mail</span>
		</div>

		<div class="input-container enabled flex relative">
			<input type="password" bind:value={password}/>
			<span>Mot de passe</span>
		</div>

		{#if error != ""}
			<span class="text-red-500 error">{error}</span>
		{/if}

		<button on:click={onClick} class="bg-[#007AFF] cursor-pointer rounded-xl text-white mt-10">
			Se connecter
		</button>
	</div>
{/key}

<style>
	h1
	{
		font-family: "Nunito-Bold";
		font-size: 35px;
		color: #09244B;
	}

	.input-container
	{
		width: 20%;
		max-width: 400px;;
	}

	.input-container input
	{
		border: 2px solid #6D6E7A;
		padding: 13px 17px 11px 17px;
		border-radius: 5px;
		font-family: "Roboto-Regular";
		font-size: 17px;
		appearance: none;
		-moz-appearance: none;
		text-align: left;
		width: 100%;
		background-color: white;
	}

	.input-container.enabled input:focus
	{
		outline: none;
		border: 2px solid #007AFF;
	}

	.input-container span
	{
		pointer-events: none;
		position: absolute;
		top: -6px;
		left: 10px;
		font-family: "Roboto-Medium";
		color: #6D6E7A;
		font-size: 14px;
		line-height: 14px;
		background-color: white;
		padding: 0px 4px 0px 4px;
	}

	.input-container.enabled:focus-within span
	{
		color: #007AFF;
	}

	.error
	{
		font-family: "Roboto-Medium";
		font-size: 18px;
	}

	button
	{
		@apply select-none;
		width: 240px;
		height: 50px;
		font-family: "Nunito-Bold";
		font-size: 18px;
		line-height: 0px;
	}

	button:hover
	{
		background-color: #005CC0;
	}
</style>
