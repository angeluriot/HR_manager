<script lang="ts">
	import RequestCard from "../components/RequestCard.svelte";

	let nb_personal_requests = 7; // From db
	let nb_incoming_requests = 2; // From db

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

<div class="main flex flex-col w-full gap-12">
	<div class="main flex flex-row gap-12">
		<div class="flex flex-col gap-12">
			<h1>Demandes personnelles</h1>
			<div class="list gap-2 flex flex-col justify-start overflow-auto">
				{#each Array(nb_personal_requests) as _}
					<RequestCard id={101} type={"Télétravail"} first_name={""} last_name={""} state={"Brouillon"} days={["Jeudi", "Mardi"]} start={"01/12/2022"} end={"31/12/2022"} comments={"None"}/>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-12">
			<h1>Demandes à valider</h1>
			<div class="list gap-2 flex flex-col justify-start overflow-auto">
				{#each Array(nb_incoming_requests) as _}
					<RequestCard id={23} type={"Télétravail"} first_name={"Jean"} last_name={"Dupont"} state={"Brouillon"} days={["Jeudi", "Mardi"]} start={"01/12/2022"} end={"31/12/2022"} comments={"None"}/>
				{/each}
			</div>
		</div>
	</div>
	<a href="/#/requests/new">Nouvelle demande</a>
</div>

<style>
.list
{
	height: 60vh;
}
</style>
