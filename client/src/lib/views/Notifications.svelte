<script lang="ts">
	import Notification from "../components/Notification.svelte";
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
	<div class="main gap-10 w-full">
		<h1>Notifications</h1>
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
		@apply gap-8 flex flex-col justify-start overflow-auto w-full pt-5 pb-8;
		height: calc(100vh - 3vw - 160px);
		padding-left: calc(5vw - 10px);
		padding-right: calc(5vw - 10px);
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.list::-webkit-scrollbar
	{
		display: none;
	}
</style>
