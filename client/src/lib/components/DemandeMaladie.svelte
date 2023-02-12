<script lang="ts">

	let myFile = "";
	let upload: HTMLInputElement;

	function showname(){
		myFile = upload.files[0].name;
	}

	let startMorning = true;
	$: startAfternoon = !startMorning;
	let endMorning = true;
	$: endAfternoon = !endMorning;

	function swapCheck(time : string){
		if(time == "start"){
			startMorning = !startMorning;
		}
		else{
			endMorning = !endMorning;
		}
	}

</script>

<div class = "flex flex-row">
	<div class = "h-full w-full justify-start">
		<label for="début">Début</label>
		<input type="date" id="début" class = "w-52">
		<div class = "flex flex-row gap-10 my-2">
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
		<input type="date" id="fin" class = "w-52">
		<div class = "flex flex-row gap-10 my-2">
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
</div>
<div>
	<label for="commentaire">Commentaire (optionnel)</label>
	<input type="text" id="commentaire" class = "w-80 h-12">
</div>
<div class = "flex flex-row gap-28 mt-3">
	<button class = "bg-[#555]">ANNULER</button>
	<button class = "bg-[#1DCF5A]">ENREGISTRER</button>
	<button class = "bg-[#007AFF]">SOUMETTRE</button>
</div>

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
