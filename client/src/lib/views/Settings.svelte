<script lang="ts">
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
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
</script>

{#key unique}
	<Menu active="Paramètres"/>
	<div class="main gap-10 w-full justify-start h-full">
		<h1 class="mt-32">Paramètres</h1>
	</div>
{/key}

<style>
	h1
	{
		font-family: "Nunito-Bold";
		font-size: 35px;
		color: #09244B;
	}
</style>
