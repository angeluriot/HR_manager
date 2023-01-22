<script lang="ts">
	import DemandeMaladie from "../components/DemandeMaladie.svelte";
	import DemandeSansSolde from "../components/DemandeSansSolde.svelte";
	import DemandeRTT from "../components/DemandeRTT.svelte";
	import DemandeTeletravail from "../components/DemandeTeletravail.svelte";
	import DemandeConge from "../components/DemandeConge.svelte";

	let requestTypes = ["Congés","Arrêt maladie","RTT","Congés sans solde","Télétravail"];
	let activeType = " ";

	const changeRequestType = (type:string) => {
		activeType = type;
		console.log(activeType);
	}
	
</script>

<div class="w-full gap-10" >
	<h1>Créer une demande : {activeType}</h1>

	<select>
		<option value="">-- Choisir un motif d'absence --</option>
		{#each requestTypes as type}
			<option value={type} on:click={() => changeRequestType(type)}>{type}</option>
		{/each}
	</select>

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
	{:else}
		<a href="/#/requests">Retour</a>
	{/if}
</div>

<style>

select {
  width: 300px;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 2px solid #007AFF;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
