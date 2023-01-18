<script lang="ts">
</script>


<div class = "flex flex-row gap-20">
	<div>
		<label for="start">Début</label>
		<input type="date" id="start">
		<label for="truc">truc (optionnel)</label>
		<input type="text" id="truc">
	</div>
	<div>
		<label for="end">Fin</label>
		<input type="date" id="end">
		<label for="comment">Commentaire (optionnel)</label>
		<input type="text" id="comment" style="height:100px;">
	</div>
	<!-- <div class="form-field">
		<label for="comment">Commentaire (optionnel)</label>
		<input type="text" id="answer-b">
	</div> -->
</div>


<style>

input{
	width: 200px;
	border-radius: 6px;
	background-color: #dcdada79;
}
label{
	margin: 10px auto;
	text-align: left;
}
</style>