<script lang="ts">
	import RequestCard from "../components/RequestCard.svelte";

	let nbOfResquests_personal = 7; // à recup de la bdd
	let nbOfResquests_toValidate = 2; // à recup de la bdd

</script>

<!--
<div class="main gap-10 w-full">
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
  
<div class="main flex flex-col w-full">
	<div class="gap-10 flex flex-row">
		<h1>Demandes personnelles</h1>
		<h1>Demandes à valider</h1>
	</div>
	<div class="gap-10 flex flex-row">
		<div class="overflow-auto h-[50%] ">
			{#each Array(nbOfResquests_personal) as _}
				<p>haha</p>
			{/each}
		</div>
		<div class="overflow-auto h-[50%]">
			{#each Array(nbOfResquests_personal) as _}
				<p>haha</p>
			{/each}
		</div>
		<!-- <div class="overflow-auto h-[50%]">
			{#each Array(nbOfResquests_personal) as _}
				<RequestCard id={101} type={"Télétravail"} first_name={""} last_name={""} state={"Brouillon"} days={["Jeudi", "Mardi"]} start={"01/12/2022"} end={"31/12/2022"} comments={"None"}/>
			{/each}
		</div>
		<div class="overflow-auto h-[50%]">
			{#each Array(nbOfResquests_toValidate) as _}
				<RequestCard id={23} type={"Télétravail"} first_name={"Jean"} last_name={"Dupont"} state={"Brouillon"} days={["Jeudi", "Mardi"]} start={"01/12/2022"} end={"31/12/2022"} comments={"None"}/>
			{/each}
		</div> -->
	</div>
	<a href="/#/requests/new">Nouvelle demande</a>
</div>

<style>

</style>
