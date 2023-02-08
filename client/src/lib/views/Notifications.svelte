<script lang="ts">
	import Notification from "../components/Notification.svelte";
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
		<h1>Notifications</h1>
		<div class="flex flex-col gap-6">
			{#each Array(3) as _}
				<Notification/>
			{/each}
		</div>
	</div>
	<Menu/>
{/key}

<style>
</style>
