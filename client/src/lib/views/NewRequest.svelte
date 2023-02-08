<script lang="ts">
	import DemandeMaladie from "../components/DemandeMaladie.svelte";
	import DemandeSansSolde from "../components/DemandeSansSolde.svelte";
	import DemandeRTT from "../components/DemandeRTT.svelte";
	import DemandeTeletravail from "../components/DemandeTeletravail.svelte";
	import DemandeConge from "../components/DemandeConge.svelte";
	import DemandeExceptionel from "../components/DemandeExceptionel.svelte";
	import DemandeAccident from "../components/DemandeAccident.svelte";
	import DemandeFormation from "../components/DemandeFormation.svelte";
	import DemandeVisite from "../components/DemandeVisite.svelte";

	let requestTypes = ["Congés","Arrêt maladie","RTT","Congés sans solde","Télétravail","Exceptionnel","Accident","Formation","Visite"];
	let activeType = " ";

	const changeRequestType = (type:string) => {
		activeType = type;
		console.log(activeType);
	}
	
</script>

<div class=" h-full w-full gap-16" >
	<div class = "flex flex-row">
		<h1 class = "text-xl mr-5">Créer une demande : </h1>

		<select>
			<option value="">-- Choisir un motif d'absence --</option>
			{#each requestTypes as type}
				<option value={type} on:click={() => changeRequestType(type)}>{type}</option>
			{/each}
		</select>
	</div>
	

	{#if activeType === "Congés"}
		<DemandeConge />
	{:else if activeType === "Arrêt maladie"}
		<DemandeMaladie />
	{:else if activeType === "RTT"}
		<DemandeRTT />
	{:else if activeType === "Congés sans solde"}
		<DemandeSansSolde />
	{:else if activeType === "Télétravail"}
		<DemandeTeletravail />
	{:else if activeType === "Exceptionnel"}
		<DemandeExceptionel />
	{:else if activeType === "Accident"}
		<DemandeAccident />
	{:else if activeType === "Formation"}
		<DemandeFormation />
	{:else if activeType === "Visite"}
		<DemandeVisite />
	{:else}
		<a href="/#/requests">Retour</a>
	{/if}
</div>

<style>

select {
  width: 300px;
  height: 35px;
  padding: 2px 8px;
  border: 2px solid #007AFF;
  border-radius: 4px;
}
</style>
