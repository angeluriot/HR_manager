<script lang="ts">
	export let id: number;
	export let type: string;
	export let first_name: string;
	export let last_name: string;
	export let state: string;
	export let days: string[];
	export let start: string;
	export let end: string;
	export let comments: string;
	import { PencilSquare } from "svelte-bootstrap-icons";

	export let colors = ["#FFFFFF", "#FF00FF", "#00FF00"];
</script>

<div id="card">
	<div id="header">
		<h2 id="title"><b>{type}</b></h2>
		<div id="state" style="--color : {colors[2]}">{state}</div>
	</div>
	<div id="body">
		{#if first_name != ""}
			<nobr><b>Nom :</b> {last_name} &nbsp; <b>Prénom :</b> {first_name}</nobr>
		{/if}
		{#if type == "Télétravail"}
			<nobr><b>Jours :</b> {#each days as _day}{_day}{/each}</nobr>
		{/if}
		<nobr><b>Début :</b> {start} &nbsp; <b>Fin :</b> {end}</nobr>
	</div>
	<div id="footer">
		<nobr><b>Commentaires :</b> {comments}</nobr>
		<a href="/#/account">
		<div id="btn-consulting">
			<PencilSquare />
			&nbsp; Consulter
		</div>
		</a>
	</div>
</div>

<style>
	#card{
		background: #FFFFFF;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
		border-radius: 10px;
		margin: 10px 10px 10px 10px;
		padding: 5px 5px 5px 5px;
		width: 30vw;
		text-align: left;
	}
	#header{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	#title{
		font-size: 1.2em;
	}
	#state{
		background-color: var(--color);
		box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.25);
		padding: 5px 5px 5px 5px;
		border-radius: 15px;
		font-size: small;
	}
	#body{
		width: 100%;
		line-height: 2em;
	}
	#btn-consulting{
		background-color: #007AFF;
		color: white;
		display: flex;
		flex-direction: row;
		padding: 5px 5px 5px 5px;
		border-radius: 8px;
		font-size: large;
	}
	#btn-consulting:hover{
		background-color: #0062CC;
	}
	a{
		text-decoration: none;
	}
	#footer{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 2em;
		padding-right: 2em;
		margin-bottom: 1em;
	}
</style>
