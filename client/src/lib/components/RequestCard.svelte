<script lang="ts">
	import Home from "../views/Home.svelte";

	export let id: number;
	export let type: string;
	export let first_name: string;
	export let last_name: string;
	export let state: string;
	export let days: string[];
	export let start: string;
	export let end: string;
	export let comments: string;
	export let purpose: string;
	import { PencilSquare } from "svelte-bootstrap-icons";

	export let colors = ["#FFFFFF", "#FF00FF", "#00FF00"];
</script>

<div id="card" class={purpose}>
	<div id="header">
		<h2 id="title"><b>{type}</b></h2>
		<div id="state" style="--color : {colors[2]}">{state}</div>
	</div>
	<div id="body" class={purpose}>
		{#if first_name != ""}
			<nobr><b>Nom :</b> {last_name} &nbsp; <b>Prénom :</b> {first_name}</nobr>
		{/if}
		{#if type == "Télétravail"}
			<nobr><b>Jours :</b> {#each days as _day}{_day} {/each}</nobr>
		{/if}
		<nobr><b>Début :</b> {start} &nbsp; <b>Fin :</b> {end}</nobr>
	</div>
	<div id="footer" class={purpose}>
		<nobr><b>Commentaires :</b> {comments}</nobr>
		<a href="#/">
		<div id="btn-consulting">
			<PencilSquare />
			&nbsp; {purpose}
		</div>
		</a>
	</div>
</div>

<style>
	#card.consulter{	
		@apply bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-[10px] p-[5px] m-[10px] w-[30vw] text-left;	 
	}
	#card.valider{
		@apply bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-[10px] p-2 w-full h-[47%] gap-12 text-left;
	}
	#header{
		@apply flex flex-row w-full justify-between;
	}
	#title{
		@apply font-[1.2em];
	}
	#state{
		@apply bg-[var(--color)] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] p-[5px] rounded-[15px] text-sm;
	}
	#body.consulter{
		@apply w-full leading-[2em];
	}
	#body.valider{
		@apply w-full gap-6;
	}
	#btn-consulting{
		@apply flex flex-row bg-[#007AFF] text-white p-[5px] rounded-lg font-medium text-lg; 
	}
	#btn-consulting:hover{
		@apply bg-[#0062CC];
	}
	
	#footer.consulter{
		@apply flex flex-row w-full justify-between px-[2em] mb-[1em] ;
	}
	#footer.valider{
		@apply flex flex-col w-full justify-between gap-8 mb-4 ;
	}
</style>
