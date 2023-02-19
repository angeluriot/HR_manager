<script lang="ts">
	import Edit from "../../assets/shapes/Edit.svg"
	import Yes from "../../assets/shapes/Yes.svg"
	import type { RequestData } from "../shared/types.js";

	export let data: RequestData;
	export let user: boolean;
	export let action: string;

	let state_color = "";

	switch (data.state)
	{
		case "Brouillon":
			state_color = "#ADB1CC";
			break;

		case "En attente":
			state_color = "#E8A525";
			break;

		default:
			state_color = "#ADB1CC";
			break;
	}

	let button_color = "";
	let button_color_hover = "";
	let button_logo = "";

	switch (action)
	{
		case "Consulter":
			button_color = "#007AFF";
			button_color_hover = "#0062CC";
			button_logo = Edit;
			break;

		case "Valider":
			button_color = "#19C97F";
			button_color_hover = "#0CA86F";
			button_logo = Yes;
			break;

		default:
			button_color = "#007AFF";
			button_color_hover = "#0062CC";
			button_logo = Edit;
			break;
	}
</script>

<div id="card" class="flex flex-col justify-start items-start w-full rounded-3xl p-5 gap-2 relative {action}">
	<header class="flex flex-row w-full justify-between mb-2">
		<h2>{data.type}</h2>
		<div id="state" class="rounded-full" style="--color: {state_color};">{data.state}</div>
	</header>
	{#if !user}
		<div class="line">
			<span class="label">Auteur :</span>
			<span class="value">{data.author.first_name} {data.author.last_name} ({data.author.department})</span>
		</div>
	{/if}
	{#if data.type == "Télétravail"}
		<div class="line">
			<span class="label">Jours :</span>
			<span class="value">
				{#each data.remote as day, i}
					{day.day + (i < data.remote.length - 1 ? ", " : "")}
				{/each}
			</span>
		</div>
	{/if}
	<div class="flex flex-row gap-4">
		<div class="line">
			<span class="label">Début :</span>
			<span class="value">{data.start.day} {data.start.pm ? "(après-midi)" : "(matin)"}</span>
		</div>
		<div class="line">
			<span class="label">Fin :</span>
			<span class="value">{data.end.day} {data.end.pm ? "(après-midi)" : "(matin)"}</span>
		</div>
	</div>
	<div class="line {action == "Consulter" ? "mb-4" : ""}">
		<span class="label">Commentaire :</span>
		<span class="value">{data.comment == "" ? "(vide)" : data.comment}</span>
	</div>
	<a href="#/" class="button-a {action == "Consulter" ? "absolute" : "ml-auto"}">
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
