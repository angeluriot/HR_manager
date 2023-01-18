<script lang="ts">
	import RequestMaladie from "../components/RequestMaladie.svelte";
	import RequestSansSolde from "../components/RequestSansSolde.svelte";
	import RequestRTT from "../components/RequestRTT.svelte";
	import RequestTeletravail from "../components/RequestTeletravail.svelte";
	import RequestConge from "../components/RequestConge.svelte";

	let requestTypes = ["Congés","Arrêt maladie","RTT","Congés sans solde","Télétravail"];
	let activeType = " ";

	const changeRequestType = (type:string) => {
		activeType = type;
		console.log(activeType);
	}
	
</script>

<div class="main gap-10" >
	<h1>Créer une demande : {activeType}</h1>

	<select>
		<option value="">-- Choisir un motif d'absence --</option>
		{#each requestTypes as type}
			<option value={type} on:click={() => changeRequestType(type)}>{type}</option>
		{/each}
	</select>

	{#if activeType === "Congés"}
		<RequestConge />
	{:else if activeType === "Arrêt maladie"}
		<RequestMaladie/>
	{:else if activeType === "RTT"}
		<RequestRTT/>
	{:else if activeType === "Congés sans solde"}
		<RequestSansSolde/>
	{:else if activeType === "Télétravail"}
		<RequestTeletravail/>
	{/if}

	<a href="/#/requests">Retour</a>
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
