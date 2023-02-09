<script lang="ts">
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/Menu.svelte';
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
</script>

{#key unique}
	<Menu active="Paramètres"/>
	<div class="main gap-10 w-full">
		<h1>Paramètres</h1>
	</div>
{/key}

<style>
</style>
