<script lang="ts">
	import RequestCard from "../components/RequestCard.svelte";
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
	});

	interface displayableRequest {
		id: string;
		type: string;
		author: string;
		state: number;
		days: string[];
		start: string;
		end: string;
		comments: string;
		action: string;
	};

	let myRequests : displayableRequest[] = [];
	let employeesRequests : displayableRequest[] = [];

	let myRequestsPromise = Server.get('get-requests');

	myRequestsPromise.then((results) => {
		console.log('Results:', results);
		// display the ID of each request found
		results.forEach((result) => {
			const request: displayableRequest = { 
				id: result._id,
				type: result.type,
				author: Global.user.first_name + ' ' + Global.user.last_name,
				state: result.state, 
				days:["Jeudi", "Mardi"],
				start: result.start,
				end: result.end,
				comments: result.comments,
				action: "consulter"
			};
			myRequests.push(request)
			console.log('Request ID:', result._id);
		});
		console.log(myRequests[0]);
	})
	.catch((error) => {
		console.error('Error:', error);
	});

	let nb_personal_requests = 7; // From db
	let nb_incoming_requests = 2; // From db

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
				{#await myRequestsPromise}
					<p>...waiting</p>
				{:then myRequests} 
					{#each myRequests as myRequest}
						<RequestCard request={myRequest}/>
					{/each}
				{/await}
				
			</div>
		</div>
		<div class="vl"></div>
		<div class="flex flex-col justify-start w-full">
			<h1 class="mb-8">Demandes à valider</h1>
			<button disabled class="bg-[#ADB1CC] rounded-xl text-white custom-margin">
				*filtres*
			</button>
			<div class="list">
				{#each Array(nb_incoming_requests) as _}
					<!-- <RequestCard id={23} type={"Télétravail"} first_name={"Jean"} last_name={"Dupont"} state={"Brouillon"} days={["Jeudi", "Mardi"]} start={"01/12/2022"} end={"31/12/2022"} comment={""} action={"Consulter"}/> -->
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
