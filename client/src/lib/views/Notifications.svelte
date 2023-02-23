<script lang="ts">
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Server from "../shared/server.js";
	import type { NotificationData } from "../shared/types.js";
	import NotificationCard from "../components/NotificationCard.svelte";

	let unique = {};
	let user_notifications: NotificationData[] = [];

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

		try
		{
			user_notifications = await Server.get('user-notifications');
		}

		catch(err)
		{
			console.error(err);
		}
	});

</script>

{#key unique}
	<Menu active="Notifications"/>
	<div class="main gap-10 w-full h-full">
		<h1 class="mt-20">Notifications</h1>
		<div class="list">
			{#each user_notifications as notif}
				<NotificationCard data={notif} />
			{/each}
		</div>
	</div>
{/key}

<style>
	.list
	{
		@apply gap-8 flex flex-col justify-start overflow-auto w-full pt-5 h-full;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.list::-webkit-scrollbar
	{
		display: none;
	}

	h1
	{
		font-family: "Nunito-Bold";
		font-size: 35px;
		color: #09244B;
	}
</style>
