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
			<img src={photo_url} alt="Avatar" class = "rounded-full w-32 h-32"/>
			<div>
				<h1> {Global.user.first_name} {Global.user.last_name}</h1>
			</div>
			<div>
				<h2 class = "text-lg font-semibold">Service : {Global.user.department}</h2>
				<p> mail : <a href={Global.user.email}>{Global.user.email}</a> </p>
			</div>
		</div>
	{/if}
{/key}

<style>
	h1
	{
		font-family: "Roboto-Bold";
	}
</style>
