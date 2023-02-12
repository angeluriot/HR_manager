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
	});

	let days = [
		{name: "Lundi",			time: { morning1: false, afternoon1: false}},
		{name: "Mardi",			time: { morning2: false, afternoon2: false}},
		{name: "Mercredi",		time: { morning3: false, afternoon3: false}},
		{name: "Jeudi",			time: { morning4: false, afternoon4: false}},
		{name: "Vendredi",		time: { morning5: false, afternoon5: false}},
	];

	const addRequest = () => 
	{
		let days_remote = [];
		let period_days_remote = [];
		days.forEach(day => {
			if (day.time[0] || day.time[1]) {
				let period = 0
				period += day.time[0] ? 1 : 0;
				period += day.time[1] ? 2 : 0;

				days_remote.push(day.name);
				period_days_remote.push(period);
			}
		});

	 	const request = {
			type: activeType,
			concerned: Global.user,
			days_remote: days_remote,
			period_days_remote: period_days_remote,
			start: start,
			start_isam: startMorning,
			end: end,
			end_isam: endMorning,
			subject_ext: subject_ext,
			place_ext: place_ext,
			proof: 0,
			cause_accident: cause_accident,
			head_dep: Global.user, // TODO : get head_dep user
			hr: Global.user, // TODO : get hr user
			comments: comments,
		}

		Server.post('add-request', '', request);

	}

	let requestTypes = ["Congés", "Maladie", "RTT", "Congés sans solde", "Télétravail", "Exceptionnel", "Accident", "Formation", "Visite"];
	let activeType = "Congés";

	let startMorning = true;
	$: startAfternoon = !startMorning;
	let endMorning = true;
	$: endAfternoon = !endMorning;
	let start;
	let end;
	let subject_ext = '';
	let place_ext = '';
	let cause_accident = '';
	let comments = '';

	let myFile = "";
	let upload: HTMLInputElement;

	let color1 = "#007AFF";
	let color2 = "#555";

	let frequency : string;
	let repeat : HTMLElement;
	let ponctualStart : HTMLElement;
	let ponctualEnd : HTMLElement;

	const changeRequestType = (type:string) => {
		activeType = type;
	}

	function swapCheck(time : string){
		if(time == "start"){
			startMorning = !startMorning;
		}
		else{
			endMorning = !endMorning;
		}
	}

	function showname(){
		myFile = upload.files[0].name;
	}

	const flipColor = (freq : string) => {
		if(freq != frequency){
			frequency = freq;

			let tmp = color1;
			color1 = color2;
			color2 = tmp;
			
			if(frequency == "ponctual"){
				repeat.style.display = "none";
				ponctualStart.style.display = "flex";
				ponctualEnd.style.display = "flex";
			}
			else{
				repeat.style.display = "flex";
				ponctualStart.style.display = "none";
				ponctualEnd.style.display = "none";
			}		
		}
	}
	
</script>

{#key unique}
	<Menu active="Demandes"/>
	<div class=" h-full w-full gap-14" >
		<div class = "flex flex-row">
			<h1 class = "text-xl mr-5">Créer une demande : </h1>

			<select class = "w-72 h-11 px-1 py-2 border-solid border-[2px] border-[#007AFF] rounded">
				{#each requestTypes as type}					
						<option value={type} on:click={() => changeRequestType(type)}>{type}</option>					
				{/each}
			</select>
		</div>
		{#if activeType=="Formation" || activeType=="Visite"}
			<div class = "flex flex-row">
				<div class = "w-full">
					{#if activeType=="Formation"}
						<label for="nom">Nom de la formation</label>
					{:else if activeType=="Visite"}
						<label for="motif">Motif de la visite</label>
					{/if}	
					<input type="text" class = "w-80" bind:value={subject_ext}>
				</div>
				<div class = "!w-full">
					{#if activeType=="Formation"}
						<label for="lieu">Lieu de la formation</label>
					{:else if activeType=="Visite"}
						<label for="lieu">Lieu de la visite</label>
					{/if}
					<input type="text" class = "w-80" bind:value={place_ext}>
				</div>
			</div>
		{/if}
		{#if activeType=="Télétravail"}
			<div class = "flex flex-row gap-32">
				<div class = "!w-[30%]">
					<button id = "ponctuel"
						class = "!h-[30px] w-[150] !rounded-[25px] !py-0 bg-[{color1}]"
						on:click={() => flipColor("ponctual")}>ponctuel</button>
				</div>
				<div class = "!w-[30%]">
					<button id = "répétition"
						class = "!h-[30px] w-[150] !rounded-[25px] !py-0 bg-[{color2}]"
						on:click={() => flipColor("repetition")}>répétition</button>
				</div>
			</div>
			<div class = "flex-row gap-10 hidden" bind:this={repeat}>
				{#each days as day}
					<div class= "!w-[15%] my-4">
						<label for={day.name}>{day.name}</label>
						<div class = "flex flex-row !gap-1 my-2">
							<div>
								<input type="checkbox" id="matin" bind:checked={day.time[0]}>
								<label for="matin">matin</label>
							</div>
							<div>
								<input type="checkbox" id="après-midi" bind:checked={day.time[1]}>
								<label for="après-midi">après-midi</label>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<div class = "flex flex-row">			
			<div class = "h-full w-full justify-start">
				<label for="début">Début</label>
				<input type="date" id="début" class = "w-52" bind:value={start}>
				<div class = "flex !flex-row gap-10 my-2" bind:this={ponctualStart}>
					<span>
						<input type="checkbox" checked={startMorning} on:change={() => swapCheck("start")}>
						<label for="matin">matin</label>
					</span>
					<span>
						<input type="checkbox" checked={startAfternoon} on:change={() => swapCheck("start")}>
						<label for="après-midi">après-midi</label>
					</span>
				</div>
			</div>
			<div class = "h-full justify-start">
				<label for="fin">Fin</label>
				<input type="date" id="fin" class = "w-52" bind:value={end}>
				<div class = "flex flex-row gap-10 my-2" bind:this={ponctualEnd}>
					<span>
						<input type="checkbox" checked={endMorning} on:change={() => swapCheck("end")}>
						<label for="matin">matin</label>
					</span>
					<span>
						<input type="checkbox" checked={endAfternoon} on:change={() => swapCheck("end")}>
						<label for="après-midi">après-midi</label>
					</span>
				</div>
			</div>
			{#if activeType=="Congés" || activeType=="RTT" || activeType=="Congés sans solde" || activeType=="Exceptionnel"}
				<div class = "h-full">
					<div class = "card h-full !w-3/5">
						<ul class = "italic font-light">
						<li>jours acquis : <strong class = "text-[#007AFF]">11</strong></li>
						<li>jours consommés : <strong class = "text-[#007AFF]">5</strong></li>
						<li>jours restants : <strong class = "text-[#007AFF]">6</strong></li>
						<li>jours demandés : <strong class = "text-[#007AFF]">3</strong></li>
						</ul>
					</div>
				</div>
			{:else if activeType=="Maladie" || activeType=="Accident"}
				<div class = "h-full">
					<div class = "h-full !w-[70%] gap-2 border-dotted border-[#a3a3a3] border-[2px]">
						<header>
							<h4>Importer un justificatif</h4>
						</header>
						<p class = "text-[#a3a3a3] text-[10px]">Fichiers acceptés: PDF, TEXT, DOC , DOCX</p>
						<input type="file" class = "hidden" accept=".doc,.docx,.pdf" bind:this={upload} on:change={ () => showname() }>
						<button class="!w-[100px] !h-[30px] bg-[#007AFF] py-0 text-[10px]" on:click={ () => upload.click() }>Parcourir...</button>
						<p class = "text-[#a3a3a3] text-[10px]">{myFile}</p>
					</div>
				</div>
			{/if}			
		</div>
		<div class = "flex flex-row">
			{#if activeType=="Accident"}
				<div class = "!w-[40%]">
					<label for="commentaire">Cause de l'accident</label>
					<input type="text" id="cause" class = "w-80 h-12" bind:value={cause_accident}>
				</div>
			{/if}
			<div class = "!w-[40%]">
				<label for="commentaire">Commentaire (optionnel)</label>
				<input type="text" id="commentaire" class = "w-80 h-12" bind:value={comments}>
			</div>
		</div>
		<div class = "flex flex-row gap-28 mt-3">
			<button class = "bg-[#555]">ANNULER</button>
			<button class = "bg-[#1DCF5A]">ENREGISTRER</button>
			<button class = "bg-[#007AFF]" on:click={addRequest}>SOUMETTRE</button>
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
