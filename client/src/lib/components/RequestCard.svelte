<script lang="ts">
	import Edit from "../../assets/shapes/Edit.svg"
	import Global from "../shared/Global"
	import Yes from "../../assets/shapes/Yes.svg"
	import { onMount } from "svelte";

	export let id: number;
	export let type: string;
	export let first_name: string;
	export let last_name: string;
	export let state: string;
	export let days: string[];
	export let start: string;
	export let end: string;
	export let comment: string = "";
	export let action: string;

	let state_color = "";

	if (state == "Brouillon")
		state_color = "#ADB1CC";
	// TODO

	let button_color = "";
	let button_color_hover = "";
	let button_logo = "";

	if (action == "Consulter")
	{
		button_color = "#007AFF";
		button_color_hover = "#0062CC";
		button_logo = Edit;
	}

	else if (action == "Valider")
	{
		button_color = "#19C97F";
		button_color_hover = "#0ca86f";
		button_logo = Yes;
	}
	// TODO

	console.log(button_color);
</script>

<div id="card" class="flex flex-col justify-start items-start w-full rounded-3xl p-5 gap-2 relative {action}">
	<header class="flex flex-row w-full justify-between mb-2">
		<h2>{type}</h2>
		<div id="state" class="rounded-full" style="--color: {state_color};">{state}</div>
	</header>
	{#if first_name != ""}
		<div class="line">
			<span class="label">Auteur :</span>
			<span class="value">{first_name} {last_name}</span>
		</div>
	{/if}
	{#if type == "Télétravail"}
		<div class="line">
			<span class="label">Jours :</span>
			<span class="value">
				{#each days as day, i}
					{day + (i < days.length - 1 ? "," : "")}
				{/each}</span>
		</div>
	{/if}
	<div class="flex flex-row gap-4">
		<div class="line">
			<span class="label">Début :</span>
			<span class="value">{start}</span>
		</div>
		<div class="line">
			<span class="label">Fin :</span>
			<span class="value">{end}</span>
		</div>
	</div>
	<div class="line mb-2">
		<span class="label">Commentaire :</span>
		<span class="value">{comment == "" ? "(vide)" : comment}</span>
	</div>
	<a href="#/" class="button-a {action == "Consulter" ? "absolute" : "ml-auto"}" on:click={ () => Global.index = -1}>
		<button class="flex flex-row justify-center items-center gap-2" style="--color: {button_color}; --hover-color: {button_color_hover};">
			<img src={button_logo} alt="edit"/>
			<span>{action}</span>
		</button>
	</a>
</div>

<style>
	div, span, a, button
	{
		white-space: nowrap;
		text-decoration: none;
	}

	#card
	{
		box-shadow: 0px 6px 25px rgb(193, 195, 206);
		max-width: 550px;
	}

	#card.consulter
	{
		margin: 10px;
		width: 30vw;
		text-align: left;
	}

	#card.valider
	{
		width: 100%;
		height: 47%;
		text-align: left;
	}

	h2
	{
		font-family: "Nunito-Bold";
		font-size: 20px;
		color: #09244B;
	}

	#state
	{
		font-family: "Nunito-SemiBold";
		font-size: 15px;
		line-height: 0px;
		color: white;
		padding: 0px 10px 0px 10px;
		background-color: var(--color);
	}

	.line
	{
		@apply flex flex-row justify-start items-center gap-2;
	}

	.label
	{
		font-family: "Nunito-Bold";
		font-size: 18px;
		color: #09244B;
	}

	.value
	{
		font-family: "Roboto-Regular";
		font-size: 16px;
		color: #09244B;
	}

	.button-a
	{
		right: 1.25rem;
		bottom: 1.25rem;
	}

	button
	{
		padding: 10px 17px 10px 14px;
		border-radius: 10px;
		background-color: var(--color);
	}

	button span
	{
		color: white;
		line-height: 0px;
		margin-bottom: -1px;
		font-family: "Nunito-SemiBold";
		font-size: 15px;
	}

	button img
	{
		width: 21px;
	}

	button:hover
	{
		background-color: var(--hover-color);
	}
</style>
