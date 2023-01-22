<script lang="ts">
	import Request from "../components/DemandeSansSolde.svelte";
</script>

<div class="main gap-10">
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
</div>

<style>
</style>
