<script lang="ts">
	import RequestCard from "../components/RequestCard.svelte";
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Server from "../shared/server.js";
	import type { RequestData } from "../shared/types.js";

	let unique = {};
	let user_requests: RequestData[] = [];
	let validation_requests: RequestData[] = [];

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
			user_requests = await Server.get('user-requests');
			validation_requests = Global.user.department == "HR" ? await Server.get('HR-requests') : await Server.get('manager-requests');			
		}

		catch(err)
		{
			console.error(err);
		}
	});
</script>

{#key unique}
	<Menu active="Demandes"/>
	<div class="main flex flex-row justify-evenly items-end w-full h-full pl-10 pr-10">
		<div class="flex flex-col justify-start w-full">
			<h1 class="mb-8">Demandes personnelles</h1>
			<a href="#/requests/new" class="custom-margin"><button class="bg-[#007AFF] cursor-pointer rounded-xl text-white">
				Nouvelle demande
			</button></a>
			<div class="list">
				{#each user_requests as user_request}
					<RequestCard data={user_request} user={true} action="Consulter"/>
				{/each}
			</div>
		</div>
		<div class="vl"></div>
		<div class="flex flex-col justify-start w-full">
			<h1 class="mb-8">Demandes à valider</h1>
			<button disabled class="bg-[#ADB1CC] rounded-xl text-white custom-margin">
				*filtres*
			</button>
			<div class="list">
				{#each validation_requests as validation_request}
					<RequestCard data={validation_request} user={false} action="Consulter"/>
				{/each}
			</div>
		</div>
	</div>
{/key}

<style>
	.vl
	{
		height: calc(100vh - 3vw - 20px);
		border-left: 2px solid #C1CBDA;
	}

	h1
	{
		font-family: "Nunito-Bold";
		font-size: 27px;
		color: #09244B;
	}

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
		background-color: #005CC0;
	}

	.custom-margin
	{
		margin-bottom: calc(1vw + 30px);
	}
</style>
