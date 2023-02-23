<script lang="ts">
	import { onMount } from "svelte";
	import { onDestroy } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Server from "../shared/server.js";
	import type { RequestData } from "../shared/types.js";
	import * as Utils from "../shared/utils.js";
	import File from "../../assets/shapes/File.svg";

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

		update_days();
	});

	// onDestroy(() => Global.displayed = null);

	const types = ["Télétravail", "Congé payé", "Congé exceptionnel", "Congé sans solde", "RTT", "Formation", "Visite extérieure", "Arrêt maladie", "Arrêt de travail", "Accident du travail"];

	// Request data
	let request_type = types[0];
	let request_state = "Brouillon";
	let request_start_date = (new Date()).toISOString().substring(0, 10);
	let request_start_pm = false;
	let request_end_date = (new Date()).toISOString().substring(0, 10);
	let request_end_pm = true;

	let request_remote = [
		{ day: "Lundi",		am: false, pm: false },
		{ day: "Mardi",		am: false, pm: false },
		{ day: "Mercredi",	am: false, pm: false },
		{ day: "Jeudi",		am: false, pm: false },
		{ day: "Vendredi",	am: false, pm: false },
		{ day: "Samedi",	am: false, pm: false },
		{ day: "Dimanche",	am: false, pm: false }
	];

	let request_subject = "";
	let request_place = "";
	let request_proof = "";
	let request_cause = "";
	let request_comment = "";

	if(Global.displayed !== null && Global.displayed.author.email === Global.user.email){
		request_type = Global.displayed.type;
		request_state = Global.displayed.state;
		//request_start_date = Global.displayed.end.day;
    	request_start_pm = Global.displayed.start.pm;
		//request_end_date = Global.displayed.end.day;
		request_end_pm = Global.displayed.end.pm;
		request_subject = Global.displayed.subject;
		request_place = Global.displayed.place;
		request_proof = Global.displayed.proof;
		request_cause = Global.displayed.cause;
		request_comment = Global.displayed.comment;
	}

	let requested_days = 1;
	let remaining_days = 1;
	let requested_rtt = 1;
	let remaining_rtt = 1;
	let upload: HTMLInputElement;
	let repeat = false;

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
			remote: request_remote.filter(day => day.am || day.pm),
			subject: request_subject,
			place: request_place,
			proof: request_proof,
			cause: request_cause,
			comment: request_comment
		};
		
		if(Global.displayed !== null && Global.displayed.author.email === Global.user.email)
		{
			await Server.post('update-draw', {update: "update"}, {to_add: request, to_remove: Global.displayed.id});
			window.location.href = "#/requests";
		}
		else
		{
			await Server.post(action + '-request', '', request);
			window.location.href = "#/requests";
		}
	}

	function update_days()
	{
		if (request_type == "Congé payé" || request_type == "Congé exceptionnel" || request_type == "RTT")
		{
			let start = new Date(request_start_date);
			let end = new Date(request_end_date);
			let days = 0;

			for (let i = start.getTime(); i <= end.getTime(); i += 86400000)
			{
				let day = new Date(i).getDay();

				if (day == 0 || day == 6)
					continue;

				days++;
			}

			days -= 0.5;

			if (request_end_pm)
				days += 0.5;

			if (request_start_pm)
				days -= 0.5;

			requested_rtt = days;
			remaining_rtt = Global.rtt_left - requested_rtt;
			requested_days = days;
			remaining_days = Global.days_left - requested_days;
		}

		else
		{
			let start = new Date(request_start_date);
			let end = new Date(request_end_date);
			let valid = end.getTime() >= start.getTime();

			if (end.getTime() == start.getTime() && request_start_pm && !request_end_pm)
				valid = false;

			requested_days = valid ? 1 : -1;
			remaining_days = valid ? 1 : -1;
		}
	}
</script>

{#key unique}
	<Menu active="Demandes"/>
	<div class="h-full w-full gap-14 flex flex-col justify-start items-center py-20 overflow-auto">
		<h1 class="mb-5">Créer une demande d'absence</h1>

		<div class="line flex flex-row justify-center items-center">
			<div class="input-container enabled flex relative w-full">
				<select bind:value={request_type} on:change={update_days}>
					{#each types as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
				<span>Type d'absence</span>
				<svg width=24 height=24 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17 10L12 15L7 10L17 10Z"/>
				</svg>
			</div>
			<div class="input-container disabled flex relative w-full">
				<input type="text" value={request_state}/>
				<span>État de la demande</span>
			</div>
		</div>

		{#if request_type == "Congé payé" || request_type == "Congé exceptionnel"}
			<div class="line flex flex-row justify-center items-center">
				<div class="input-container disabled flex relative w-full {requested_days <= 0 ? "invalid" : ""}">
					<input type="text" value={requested_days <= 0 ? "???" : requested_days}/>
					<span>Nombre de jours de congés demandés</span>
				</div>
				<div class="input-container disabled flex relative w-full {remaining_days < 0 || requested_days <= 0 ? "invalid" : ""}">
					<input type="text" value={requested_days <= 0 ? "???" : remaining_days}/>
					<span>Nombre de jours de congés restants</span>
				</div>
			</div>
		{/if}

		{#if request_type == "RTT"}
			<div class="line flex flex-row justify-center items-center">
				<div class="input-container disabled flex relative w-full {requested_rtt <= 0 ? "invalid" : ""}">
					<input type="text" value={requested_rtt <= 0 ? "???" : requested_rtt}/>
					<span>Nombre de RTT demandés</span>
				</div>
				<div class="input-container disabled flex relative w-full {remaining_rtt < 0 || requested_rtt <= 0 ? "invalid" : ""}">
					<input type="text" value={requested_rtt <= 0 ? "???" : remaining_rtt}/>
					<span>Nombre de RTT restants</span>
				</div>
			</div>
		{/if}

		{#if request_type == "Télétravail"}
			<div class="remote flex flex-col justify-center items-center w-full gap-10 mt-4 mb-2">
				<div class="flex flex-row justify-center items-center gap-[80px]">
					<button class="rounded-full {repeat ? "" : "selected"}" on:click={() => { repeat = false }}>Ponctuel</button>
					<button class="rounded-full {repeat ? "selected" : ""}" on:click={() => { repeat = true }}>Répétition</button>
				</div>
				<div class="remote-days flex-row w-full justify-center items-center {repeat ? "" : "hidden"}">
					<div class="flex flex-col justify-end items-start h-full gap-[17px]">
						<span>Matin</span>
						<span class="mb-[-2px]">Après-midi</span>
					</div>
					{#each request_remote as day}
					<div class="flex flex-col justify-center items-center gap-4">
						<span>{day.day}</span>
						<input type="checkbox" bind:checked={day.am}/>
						<input type="checkbox" bind:checked={day.pm}/>
					</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if request_type == "Formation"}
			<div class="line flex flex-row justify-center items-center">
				<div class="input-container enabled flex relative w-full">
					<input type="text" bind:value={request_subject}/>
					<span>Nom de la formation</span>
				</div>
				<div class="input-container enabled flex relative w-full">
					<input type="text" bind:value={request_place}/>
					<span>Lieu de la formation</span>
				</div>
			</div>
		{/if}

		{#if request_type == "Visite extérieure"}
			<div class="line flex flex-row justify-center items-center">
				<div class="input-container enabled flex relative w-full">
					<input type="text" bind:value={request_subject}/>
					<span>Sujet de la visite</span>
				</div>
				<div class="input-container enabled flex relative w-full">
					<input type="text" bind:value={request_place}/>
					<span>Lieu de la visite</span>
				</div>
			</div>
		{/if}

		<div class="line flex flex-row justify-center items-center">
			<div class="date flex flex-col justify-center items-center w-full gap-6">
				<div class="day flex relative w-full">
					<span class="absolute">Date de début</span>
					<input type="date" class="w-full" bind:value={request_start_date} on:change={update_days}/>
				</div>
				<div class="hour flex flex-row justify-evenly items-center w-full mt-2">
					<div class="flex flex-row justify-center items-center gap-3">
						<input type="radio" bind:group={request_start_pm} name="start" value={false} on:change={update_days}>
						<span>Matin</span>
					</div>
					<div class="flex flex-row justify-center items-center gap-3">
						<input type="radio" bind:group={request_start_pm} name="start" value={true} on:change={update_days}>
						<span>Après-midi</span>
					</div>
				</div>
			</div>
			<div class="date flex flex-col justify-center items-center w-full gap-6">
				<div class="day flex relative w-full">
					<span class="absolute">Date de fin</span>
					<input type="date" class="w-full" bind:value={request_end_date} on:change={update_days}/>
				</div>
				<div class="hour flex flex-row justify-evenly items-center w-full mt-2">
					<div class="flex flex-row justify-center items-center gap-3">
						<input type="radio" bind:group={request_end_pm} name="end" value={false} on:change={update_days}>
						<span>Matin</span>
					</div>
					<div class="flex flex-row justify-center items-center gap-3">
						<input type="radio" bind:group={request_end_pm} name="end" value={true} on:change={update_days}>
						<span>Après-midi</span>
					</div>
				</div>
			</div>
		</div>

		{#if request_type == "Accident du travail"}
			<div class="line flex flex-row justify-center items-center">
				<div class="comment flex justify-start items-start relative w-full">
					<span>Cause de l'accident</span>
					<textarea rows=5 bind:value={request_cause}/>
				</div>
				<div class="proof flex flex-col h-full w-full justify-start items-start" on:click={ () => upload.click() } on:keyup={ () => upload.click() }>
					<span>Certificat médical</span>
					<div class="file flex flex-col h-full justify-center items-center w-full">
						<img src={File} alt="file"/>
						<div class="flex flex-row w-full gap-[5px]">
							<h2 class="link">Cliquer pour importer</h2>
							<h2>ou glisser-déposer</h2>
						</div>
						<span>PDF, PNG ou JPG (max. 3MB)</span>
						<input type="file" class="hidden" accept=".pdf,.png,.jpg,.jpeg" bind:this={upload}>
					</div>
				</div>
			</div>
		{/if}

		{#if request_type == "Arrêt maladie" || request_type == "Arrêt de travail"}
			<div class="line flex flex-row justify-center items-center">
				<div class="proof flex flex-col h-full w-full justify-start items-start" on:click={ () => upload.click() } on:keyup={ () => upload.click() }>
					<span>Certificat médical</span>
					<div class="file flex flex-col h-full justify-center items-center w-full">
						<img src={File} alt="file"/>
						<div class="flex flex-row w-full gap-[5px]">
							<h2 class="link">Cliquer pour importer</h2>
							<h2>ou glisser-déposer</h2>
						</div>
						<span>PDF, PNG ou JPG (max. 3MB)</span>
						<input type="file" class="hidden" accept=".pdf,.png,.jpg,.jpeg" bind:this={upload}>
					</div>
				</div>
				<div class="comment flex justify-start items-start relative w-full">
					<span>Commentaire (optionnel)</span>
					<textarea rows=5 bind:value={request_comment}/>
				</div>
			</div>
		{:else}
		<div class="line flex flex-row justify-center items-center">
			<div class="comment flex justify-start items-start relative w-full">
				<span>Commentaire (optionnel)</span>
				<textarea rows=3 bind:value={request_comment}/>
			</div>
		</div>
		{/if}

		<div class="buttons flex flex-row gap-20 mt-5">
			<button class="bg-[#9092A6] hover:bg-[#77788a]" on:click={async () => { await Server.post('update-draw', {update: "delete"}, {to_add: '', to_remove: Global.displayed.id});window.location.href = "#/requests"; }}>ANNULER</button>
			{#if request_type == "RTT"}
				<button class="bg-[#1DCF5A] hover:bg-[#1cb75c] {remaining_rtt < 0 || requested_rtt <= 0 ? "invalid" : ""}" on:click={() => send_request("save")}>ENREGISTRER</button>
				<button class="bg-[#007AFF] hover:bg-[#1a6bdc] {remaining_rtt < 0 || requested_rtt <= 0 ? "invalid" : ""}" on:click={() => send_request("send")}>SOUMETTRE</button>
			{:else}
				<button class="bg-[#1DCF5A] hover:bg-[#1cb75c] {remaining_days < 0 || requested_days <= 0 ? "invalid" : ""}" on:click={() => send_request("save")}>ENREGISTRER</button>
				<button class="bg-[#007AFF] hover:bg-[#1a6bdc] {remaining_days < 0 || requested_days <= 0 ? "invalid" : ""}" on:click={() => send_request("send")}>SOUMETTRE</button>
			{/if}
		</div>
	</div>
{/key}

<style>
	h1
	{
		font-family: "Nunito-Bold";
		font-size: 27px;
		color: #09244B;
	}

	.line
	{
		width: calc(50% + 280px);
		max-width: 1200px;
		gap: calc(38% - 220px);
	}

	.input-container.disabled
	{
		pointer-events: none;
	}

	.input-container select, .input-container input
	{
		border: 2px solid #6D6E7A;
		padding: 13px 17px 11px 17px;
		border-radius: 5px;
		font-family: "Roboto-Regular";
		font-size: 17px;
		appearance: none;
		-moz-appearance: none;
		text-align: left;
		width: 100%;
		background-color: white;
	}

	.input-container.disabled select, .input-container.disabled input
	{
		border: 2px solid #E4E5ED;
		color: #9092A6;
	}

	.input-container select
	{
		outline: none;
		cursor: pointer;
		user-select: none;
	}

	.input-container.enabled select:focus, .input-container.enabled input:focus
	{
		outline: none;
		border: 2px solid #007AFF;
	}

	.input-container option
	{
		font: "Roboto-Regular" sans-serif;
		font-size: 17px;
		text-align: left;
	}

	.input-container span
	{
		pointer-events: none;
		position: absolute;
		top: -6px;
		left: 10px;
		font-family: "Roboto-Medium";
		color: #6D6E7A;
		font-size: 14px;
		line-height: 14px;
		background-color: white;
		padding: 0px 4px 0px 4px;
	}

	.input-container.disabled span
	{
		color: #9092A6;
		font-family: "Roboto-Regular";
	}

	.input-container.enabled:focus-within span
	{
		color: #007AFF;
	}

	.input-container svg
	{
		cursor: pointer;
		position: absolute;
		right: 12px;
		fill: #6D6E7A;
		pointer-events: none;
	}

	.input-container.enabled:focus-within svg
	{
		fill: #007AFF;
	}

	.input-container.invalid input
	{
		border: 2px solid #ff3a305e;
		color: #ff3a30a3;
	}

	.input-container.invalid span
	{
		color: #ff3a30a3;
	}

	.day
	{
		padding: 28px 15px 6px 13px;
		border-radius: 5px;
		font-family: "Roboto-Regular";
		font-size: 17px;
		text-align: left;
		width: 100%;
		background-color: #e9ecee;
		text-align: left;
	}

	.day input
	{
		outline: none;
		border: none;
		background: none;
		user-select: none;
		text-align: left;
	}

	.day input::-webkit-calendar-picker-indicator
	{
		opacity: 0.6;
		cursor: pointer;
		width: 20px;
		height: 20px;
	}

	.day span
	{
		position: absolute;
		top: 10px;
		left: 13px;
		font-family: "Roboto-Medium";
		font-size: 14px;
		line-height: 14px;
		pointer-events: none;
		color: black;
		opacity: 0.6;
	}

	.day input:hover
	{
		outline: none;
	}

	input[type="radio"], input[type="checkbox"]
	{
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;

		width: 26px;
		height: 26px;
		cursor: pointer;
		border: 2px solid #B1B3C5;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	input[type="radio"]:checked::after, input[type="checkbox"]:checked::after
	{
		content: "";
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #007AFF;
	}

	.hour span
	{
		font-family: "Nunito-SemiBold";
		color: #526581;
		font-size: 17px;
		line-height: 0px;
		margin-top: 1px;
	}

	.comment span, .proof span
	{
		pointer-events: none;
		font-family: "Roboto-Medium";
		color: #6D6E7A;
		font-size: 14px;
		margin-bottom: 5px;
	}

	.comment textarea
	{
		resize: none;
		outline: none;
		width: 100%;
		text-align: left;
		font-family: "Roboto-Regular";
		font-size: 17px;
		appearance: none;
		-moz-appearance: none;
		padding-left: 1px;
		border-bottom: 2px solid #6D6E7A;
	}

	.comment textarea:focus
	{
		outline: none;
		border-bottom: 2px solid #007AFF;
	}

	.comment:focus-within span
	{
		color: #007AFF;
	}

	.proof .file
	{
		border: 2px dashed #e1e3e7;
		border-radius: 8px;
		cursor: pointer;
		gap: 3px;
		padding-top: 5px;
	}

	.proof .file h2
	{
		font-family: "Roboto-Medium";
		color: rgb(71, 72, 79);
		font-size: 16px;
		margin-top: 4px;
	}

	.proof .file h2.link
	{
		color: #007AFF;
	}

	.proof .file span
	{
		font-family: "Roboto-Regular";
		font-size: 14px;
	}

	.proof .file:hover
	{
		background-color: #f8f9fac0;
	}

	.buttons button
	{
		padding: 27px 50px 26px 50px;
		border-radius: 10px;
		color: white;
		font-family: "Roboto-Medium";
		line-height: 0px;
	}

	.buttons button.invalid
	{
		opacity: 0.3;
		pointer-events: none;
	}

	.remote button
	{
		padding: 23px 50px 22px 50px;
		line-height: 0px;
		font-family: "Nunito-SemiBold";
		font-size: 17px;
		color: #526581;
		user-select: none;
	}

	.remote button:hover
	{
		background-color: #e0efff;
	}

	.remote button.selected
	{
		background-color: #007AFF;
		color: white;
		pointer-events: none;
	}

	.remote-days
	{
		gap: min(calc(5% - 10px), 60px);
	}

	.remote-days span
	{
		font-family: "Nunito-SemiBold";
		font-size: 17px;
		color: #526581;
	}

	span
	{
		pointer-events: none;
		user-select: none;
	}
</style>
