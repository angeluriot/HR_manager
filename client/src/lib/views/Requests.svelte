<script lang="ts">
	import RequestCard from "../components/RequestCard.svelte";

	let nbOfResquests = 4; // à recup de la bdd

</script>

<!-- <div class="main gap-10">
	<h1>Demandes</h1>
	<div class="flex flex-row gap-6">
		<div class="flex flex-col gap-6">
			{#each Array(3) as _}
				<Request/>
			{/each}
		</div>
		<div class="flex flex-col gap-6">
			{#each Array(3) as _}
				<Request/>
			{/each}
		</div>
	</div>
	<a href="/#/requests/new">Nouvelle demande</a>
</div> -->
  
<div id="container" class="main gap-10">
	<div id="sub-container">
		<h1>Demandes personnelles</h1>
		<div id="scrollable">
			{#each Array(nbOfResquests) as _}
				<RequestCard type={"Télétravail"} state={"Brouillon"} days={["Jeudi", "Mardi"]} start={"01/12/2022"} end={"31/12/2022"} comments={"None"}/>
			{/each}
		</div>
	</div>
	<div id="sub-container">
		<h1>Demandes à valider</h1>

	</div>
</div>

<style>
	#container{
		flex-direction: row;
		display: flex;
    	height: 100vh;
		margin-left: 300px;
	}
	#sub-container{
		height: 100vh;
	}
	#scrollable{
		overflow: auto;
	}
</style>
