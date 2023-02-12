<script lang="ts">

	let color1 = "#007AFF";
	let color2 = "#555";

	let frequency : string;
	let repeat : HTMLElement;
	let ponctualStart : HTMLElement;
	let ponctualEnd : HTMLElement;

	let days = [
		{name: "Lundi",			time: { morning1: false, afternoon1: false}},
		{name: "Mardi",			time: { morning2: false, afternoon2: false}},
		{name: "Mercredi",		time: { morning3: false, afternoon3: false}},
		{name: "Jeudi",			time: { morning4: false, afternoon4: false}},
		{name: "Vendredi",		time: { morning5: false, afternoon5: false}},
	];

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

<div class = "gap-8">
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
	<div class = "flex-row !gap-10 hidden" bind:this={repeat}>
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
	<div class = "flex flex-row gap-32">
		<div class = "h-full !w-[30%] justify-start">
			<label for="début">Début</label>
			<input type="date" id="début" class = "w-52">
			<div class = "flex flex-row gap-10 my-2" bind:this={ponctualStart}>
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
		<div class = "h-full !w-[30%] justify-start">
			<label for="fin">Fin</label>
			<input type="date" id="fin" class = "w-52">
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
</div>

<style>
	div{
		@apply w-full;
	}

	span{
		@apply my-6;
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
</style>
