<script lang="ts">
	import { Absences } from "../shared/utils";
	import * as Server from "../shared/server";
	let myFile = "";
	const showname = () => {
		let input = <HTMLInputElement>document.getElementById("fileID");
		myFile = input.files[0].name;
	}
	let start = new Date();
	let start_is_am = true;
	let start_is_pm = false;
	let end = new Date();
	let end_is_am = true;
	let end_is_pm = false;
	let cause = "";
	let comments = "";
	const addRequest = () => {
		let requestAbsence = {
			type: Absences.accident,
			concerned: null, // TODO
			state: 0,
			days_remote: Array(),
			start: [start, start_is_pm], // [Date, 0 pour matin / 1 pour aprem]
			subject_ext: "",
			place_ext: "",
			proof: myFile, //TODO : file
			cause_accident: cause,
			head_dep: null, //TODO
			hr: null, // TODO
			comments: comments
		};
		console.log("here demande");
		Server.post("add-request", '', {request_data: requestAbsence});
	};
</script>

<div class = "flex flex-row">
	<div class = "h-full w-full justify-start">
		<label for="début">Début</label>
		<input type="date" id="début" class = "w-52" bind:value={start}>
		<div class = "flex flex-row gap-10 my-2">
			<span>
				<input type="checkbox" id="matin" name="matin" checked bind:value={start_is_am}>
				<label for="matin">matin</label>
			</span>
			<span>
				<input type="checkbox" id="après-midi" name="après-midi" bind:value={start_is_pm}>
				<label for="après-midi">après-midi</label>
			</span>
		</div>
	</div>
	<div class = "h-full justify-start">
		<label for="fin">Fin</label>
		<input type="date" id="fin" class = "w-52" bind:value={end}>
		<div class = "flex flex-row gap-10 my-2">
			<span>
				<input type="checkbox" id="matin" checked bind:value={end_is_am}>
				<label for="matin">matin</label>
			</span>
			<span>
				<input type="checkbox" id="après-midi" bind:value={end_is_pm}>
				<label for="après-midi">après-midi</label>
			</span>
		</div>
	</div>
	<div class = "h-full">
		<div class = "h-full !w-[70%] gap-2 border-dotted border-[#a3a3a3] border-[2px]">
			<header>
				<h4>Importer un justificatif</h4>
			</header>
			<p class = "text-[#a3a3a3] text-[10px]">Fichiers acceptés: PDF, TEXT, DOC , DOCX</p>
			<input type="file" class = "hidden" accept=".doc,.docx,.pdf" id="fileID" name="filename" on:change={ () => showname() }>
			<button class="!w-[100px] !h-[30px] bg-[#007AFF] py-0 text-[10px]" on:click={ () => document.getElementById("fileID").click() }>Parcourir...</button>
			<p class = "text-[#a3a3a3] text-[10px]">{myFile}</p>
		</div>
	</div>
</div>
<div class = "flex flex-row">
	<div class = "!w-[40%]">
		<label for="commentaire">Cause de l'accident</label>
		<input type="text" id="cause" class = "w-80 h-12" bind:value={cause}>
	</div>
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

<style>
	div{
		@apply w-full;
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
