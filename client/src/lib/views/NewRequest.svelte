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
	<div class="main gap-10">
		<h1>Créer une demande</h1>
		<a href="#/requests">Retour</a>
	</div>
	<Menu/>
{/key}

<style>
</style>
