<script lang="ts">
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Server from "../shared/server.js";
	import type { RequestData } from "../shared/types.js";
	import * as Utils from "../shared/utils.js";

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

	const remote_days = [
		{ day: "Lundi",		am: false, pm: false },
		{ day: "Mardi",		am: false, pm: false },
		{ day: "Mercredi",	am: false, pm: false },
		{ day: "Jeudi",		am: false, pm: false },
		{ day: "Vendredi",	am: false, pm: false },
		{ day: "Samedi",	am: false, pm: false },
		{ day: "Dimanche",	am: false, pm: false }
	];

	const types = ["Congés", "Maladie", "RTT", "Congés sans solde", "Télétravail", "Exceptionnel", "Accident", "Formation", "Visite"];

	let today = new Date();
	let tomorrow = new Date();
	tomorrow.setDate(today.getDate() + 1);

	// Request data
	let request_type = types[0];
	let request_start_date = today.toISOString().substring(0, 10);
	let request_start_pm = false;
	let request_end_date = tomorrow.toISOString().substring(0, 10);
	let request_end_pm = true;
	let request_remote = [];
	let request_subject = "";
	let request_place = "";
	let request_proof = "";
	let request_cause = "";
	let request_comment = "";

	let upload: HTMLInputElement;
	let file: string;
	let color1 = "#007AFF";
	let color2 = "#555";
	let frequency : string;
	let repeat : HTMLElement;
	let ponctualStart : HTMLElement;
	let ponctualEnd : HTMLElement;

	async function send_request(action: string)
	{
		let request: RequestData = {
			id: "",
			type: request_type,
			author: { email: Global.user.email, first_name: Global.user.first_name, last_name: Global.user.last_name, department: Global.user.department },
			state: action == "save" ? "Brouillon" : "En attente",
			manager: null,
			hr: null,
			start: { day: Utils.date_to_string(new Date(request_start_date)), pm: request_start_pm },
			end: { day: Utils.date_to_string(new Date(request_end_date)), pm: request_end_pm },
			remote: request_remote,
			subject: request_subject,
			place: request_place,
			proof: request_proof,
			cause: request_cause,
			comment: request_comment
		};

		await Server.post(action + '-request', '', request);
		window.location.href = "#/requests";
	}

	function show_name()
	{
		file = upload.files[0].name;
	}

	function flip_color(freq: string)
	{
		if (freq != frequency)
		{
			frequency = freq;

			let tmp = color1;
			color1 = color2;
			color2 = tmp;

			if (frequency == "ponctual")
			{
				repeat.style.display = "none";
				ponctualStart.style.display = "flex";
				ponctualEnd.style.display = "flex";
			}

			else
			{
				repeat.style.display = "flex";
				ponctualStart.style.display = "none";
				ponctualEnd.style.display = "none";
			}
		}
	}

</script>

{#key unique}
	<Menu active="Demandes"/>
	<div class="h-full w-full gap-14">
		<div class="flex flex-row">
			<h1 class="text-xl mr-5">Créer une demande :</h1>

			<select class="w-72 h-11 px-1 py-2 border-solid border-[2px] border-[#007AFF] rounded" bind:value={request_type}>
				{#each types as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		{#if request_type == "Formation" || request_type == "Visite"}
			<div class="flex flex-row">
				<div class="w-full">
					{#if request_type == "Formation"}
						<label for="nom">Nom de la formation</label>
					{:else if request_type == "Visite"}
						<label for="motif">Motif de la visite</label>
					{/if}
					<input type="text" class="w-80" bind:value={request_subject}>
				</div>
				<div class="!w-full">
					{#if request_type == "Formation"}
						<label for="lieu">Lieu de la formation</label>
					{:else if request_type == "Visite"}
						<label for="lieu">Lieu de la visite</label>
					{/if}
					<input type="text" class="w-80" bind:value={request_place}>
				</div>
			</div>
		{/if}
		{#if request_type == "Télétravail"}
			<div class="flex flex-row gap-32">
				<div class="!w-[30%]">
					<button id = "ponctuel"
						class="!h-[30px] w-[150] !rounded-[25px] !py-0 bg-[{color1}]"
						on:click={() => flip_color("ponctual")}>ponctuel</button>
				</div>
				<div class="!w-[30%]">
					<button id = "répétition"
						class="!h-[30px] w-[150] !rounded-[25px] !py-0 bg-[{color2}]"
						on:click={() => flip_color("repetition")}>répétition</button>
				</div>
			</div>
			<div class="flex-row gap-10 hidden" bind:this={repeat}>
				{#each remote_days as remote_day}
					<div class= "!w-[15%] my-4">
						<label for={remote_day.day}>{remote_day.day}</label>
						<div class="flex flex-row !gap-1 my-2">
							<div>
								<input type="checkbox" id="matin" bind:checked={remote_day.am}>
								<label for="matin">matin</label>
							</div>
							<div>
								<input type="checkbox" id="après-midi" bind:checked={remote_day.pm}>
								<label for="après-midi">après-midi</label>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<div class="flex flex-row">
			<div class="h-full w-full justify-start">
				<label for="début">Début</label>
				<input type="date" id="début" class="w-52" bind:value={request_start_date}>
				<div class="flex !flex-row gap-10 my-2" bind:this={ponctualStart}>
					<span>
						<input type="radio" bind:group={request_start_pm} name="start" value={false}>
						<label for="matin">matin</label>
					</span>
					<span>
						<input type="radio" bind:group={request_start_pm} name="start" value={true}>
						<label for="après-midi">après-midi</label>
					</span>
				</div>
			</div>
			<div class="h-full justify-start">
				<label for="fin">Fin</label>
				<input type="date" id="fin" class="w-52" bind:value={request_end_date}>
				<div class="flex flex-row gap-10 my-2" bind:this={ponctualEnd}>
					<span>
						<input type="radio" bind:group={request_end_pm} name="end" value={false}>
						<label for="matin">matin</label>
					</span>
					<span>
						<input type="radio" bind:group={request_end_pm} name="end" value={true}>
						<label for="après-midi">après-midi</label>
					</span>
				</div>
			</div>
			{#if request_type == "Congés" || request_type == "RTT" || request_type == "Congés sans solde" || request_type == "Exceptionnel"}
				<div class="h-full">
					<div class="card h-full !w-3/5">
						<ul class="italic font-light">
							<li>jours acquis :<strong class="text-[#007AFF]">11</strong></li>
							<li>jours consommés :<strong class="text-[#007AFF]">5</strong></li>
							<li>jours restants :<strong class="text-[#007AFF]">6</strong></li>
							<li>jours demandés :<strong class="text-[#007AFF]">3</strong></li>
						</ul>
					</div>
				</div>
			{:else if request_type == "Maladie" || request_type == "Accident"}
				<div class="h-full">
					<div class="h-full !w-[70%] gap-2 border-dotted border-[#a3a3a3] border-[2px]">
						<header>
							<h4>Importer un justificatif</h4>
						</header>
						<p class="text-[#a3a3a3] text-[10px]">Fichiers acceptés: PDF, TEXT, DOC, DOCX</p>
						<input type="file" class="hidden" accept=".doc,.docx,.pdf" bind:this={upload} on:change={ () => show_name() }>
						<button class="!w-[100px] !h-[30px] bg-[#007AFF] py-0 text-[10px]" on:click={ () => upload.click() }>Parcourir...</button>
						<p class="text-[#a3a3a3] text-[10px]">{file}</p>
					</div>
				</div>
			{/if}
		</div>
		<div class="flex flex-row">
			{#if request_type == "Accident"}
				<div class="!w-[40%]">
					<label for="commentaire">Cause de l'accident</label>
					<input type="text" id="cause" class="w-80 h-12" bind:value={request_cause}>
				</div>
			{/if}
			<div class="!w-[40%]">
				<label for="commentaire">Commentaire (optionnel)</label>
				<input type="text" id="commentaire" class="w-80 h-12" bind:value={request_comment}>
			</div>
		</div>
		<div class="flex flex-row gap-28 mt-3">
			<button class="bg-[#555]" on:click={() => { window.location.href = "#/requests"; }}>ANNULER</button>
			<button class="bg-[#1DCF5A]" on:click={() => send_request("save")}>ENREGISTRER</button>
			<button class="bg-[#007AFF]" on:click={() => send_request("send")}>SOUMETTRE</button>
		</div>
	</div>
{/key}

<style>

	div{
		@apply w-full;
	}

	span{
		@apply my-6;
	}

	input{
		@apply rounded-md bg-[#dcdada79] border-[1px] border-[#61a3eb];
	}

	label{
		@apply my-[10px] text-left;
	}

	button{
		@apply border-0 w-[200px] h-[40px] cursor-pointer rounded-md py-2 px-3 font-bold text-white shadow-[1px_2px_3px_rgba(0,0,0,0.2)];
	}

	.card{
		@apply p-1 bg-[#dcdada79] rounded-md shadow-[0px_2px_4px_rgba(6,88,239,0.42)];
	}

</style>
