<script lang="ts">
</script>


<div class = "flex flex-row">
	<div class = "h-full justify-start">
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
	<div class = "h-full justify-start">
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
	<div class = "h-full">
		<div class = "card h-full w-3/5">
			<ul class = "italic font-light">
			<li>jours acquis : <strong class = "text-[#007AFF]">11</strong></li>
			<li>jours consommés : <strong class = "text-[#007AFF]">5</strong></li>
			<li>jours restants : <strong class = "text-[#007AFF]">6</strong></li>
			<li>jours demandés : <strong class = "text-[#007AFF]">3</strong></li>
			</ul>
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

input{
	border-radius: 6px;
	background-color: #dcdada79;
}
label{
	margin: 10px auto;
	text-align: left;
}
.card{
        background: #dcdada79;
        padding: 3px;
        border-radius: 6px;
        box-shadow: 0px 2px 4px rgba(6, 88, 239, 0.42);
}
button{
        border: 0;
		width: 200px;
		height: 40px;
        cursor: pointer;
        border-radius: 6px;
        padding: 8px 12px;
        font-weight: bold;
		color: white;
        box-shadow: 1px 2px 3px rgba(0,0,0,0.2);
}


</style>