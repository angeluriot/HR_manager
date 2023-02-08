<script lang="ts">
	import RequestCard from "../components/RequestCard.svelte";
	import { Plus } from "svelte-bootstrap-icons";
    import NewRequest from "./NewRequest.svelte";

	let nb_personal_requests = 7; // From db
	let nb_incoming_requests = 2; // From db

</script>

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
	<a href="/#/requests/new">
	<button class="bg-[#007AFF]">
		Nouvelle demande
	</button>
	</a>
</div>

<style>
.list
{
	height: 60vh;
}
button{
	@apply border-0 w-[200px] h-[40px] cursor-pointer rounded-md py-2 px-3 font-bold text-white shadow-[1px_2px_3px_rgba(0,0,0,0.2)];
}

button:hover{
	@apply bg-[#005CC0];
}
</style>
