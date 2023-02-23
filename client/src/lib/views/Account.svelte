<script lang="ts">
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Cookie from "../shared/cookie.js";
	import * as Server from "../shared/server.js";

	let unique = {};

	function restart()
	{
		unique = {}
	}

	onMount(async () =>
	{
		if (!Global.user)
		{
			await Server.auto_login();
			restart();
		}

		else
		{
			await Server.update_info();
			restart();
		}
	});

	let token = Cookie.get_token();

	if (!token)
		Server.logout();

	let photo_url = Global.server_url + "photo?" + new URLSearchParams({ token });
</script>

{#key unique}
	{#if Global.user}
		<Menu active="Compte"/>
		<div class="flex flex-col justify-center items-center w-full gap-6">
			<img src={photo_url} alt="Avatar" class="rounded-full w-32 h-32 mb-3"/>
			<h1> {Global.user.first_name} {Global.user.last_name}</h1>
			<div class="flex flex-row gap-5 w-full justify-center my-8">
				<div class="flex flex-col justify-center items-end gap-5 w-full">
					<h2>Service :</h2>
					<h2>E-mail :</h2>
					<h2>Jours de congé restants :</h2>
					<h2>RTT restants :</h2>
				</div>
				<div class="flex flex-col justify-center items-start gap-5 w-full">
					<span>{Global.user.department}</span>
					<a href={Global.user.email}>{Global.user.email}</a>
					<span>{Global.days_left}</span>
					<span>{Global.rtt_left}</span>
				</div>
			</div>
			<a href="#/requests/new"><button class="bg-[#fc3c3c] cursor-pointer rounded-xl text-white" on:click={Server.logout}>
				Se déconnecter
			</button></a>
		</div>
	{/if}
{/key}

<style>
	h1
	{
		font-family: "Nunito-Bold";
		font-size: 35px;
		color: #09244B;
	}

	h2
	{
		font-family: "Nunito-Bold";
		font-size: 20px;
		color: #09244B;
	}

	span, a
	{
		font-family: "Roboto-Regular";
		font-size: 20px;
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

	a button:hover
	{
		background-color: #dc2632;
	}
</style>
