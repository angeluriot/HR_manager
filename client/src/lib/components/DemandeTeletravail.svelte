<script lang="ts">

	let color1 = "#007AFF";
	let color2 = "#555";

	const flipColor = () => {
		let tmp = color1;
		color1 = color2;
		color2 = tmp;
	}

</script>

<div class = "flex flex-row gap-8">
	<button id = "ponctuel" 
			class = "!h-[30px] w-[150] !rounded-[25px] !py-0 bg-[{color1}]" 
			on:click={() => flipColor()}>ponctuel</button>
	<button id = "répétition" 
			class = "!h-[30px] w-[150] !rounded-[25px] !py-0 bg-[{color2}]"
			on:click={() => flipColor()}>répétition</button>
</div>
<div class = "flex flex-row gap-32">
	<div class = "h-full !w-auto justify-start">
		<label for="début">Début</label>
		<input type="date" id="début" class = "w-52">
		<div class = "flex flex-row gap-10 my-2">
			<span>
				<input type="checkbox" id="matin" name="matin" checked>
				<label for="matin">matin</label>
			</span>
			<span>
				<input type="checkbox" id="après-midi" name="après-midi">
				<label for="après-midi">après-midi</label>
			</span>
		</div>
	</div>
	<div class = "h-full !w-auto justify-start">
		<label for="fin">Fin</label>
		<input type="date" id="fin" class = "w-52">
		<div class = "flex flex-row gap-10 my-2">
			<span>
				<input type="checkbox" id="matin" checked>
				<label for="matin">matin</label>
			</span>
			<span>
				<input type="checkbox" id="après-midi">
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


<style>
div{
	@apply w-full;
}

input{
	@apply rounded-md bg-[#dcdada79];
}

label{
	@apply my-[10px] text-left;
}

button{
	@apply border-0 w-[200px] h-[40px] cursor-pointer rounded-md py-2 px-3 font-bold text-white shadow-[1px_2px_3px_rgba(0,0,0,0.2)];
}
</style>