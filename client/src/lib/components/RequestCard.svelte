<script lang="ts">
	import Edit from "../../assets/shapes/Edit.svg"
	import Yes from "../../assets/shapes/Yes.svg"
	import No from "../../assets/shapes/No.svg"
	import Global from "../shared/Global"
	import * as Server from "../shared/server"
	import type { RequestData, UserData } from "../shared/types.js";

	export let data: RequestData;
	export let user: boolean;
	export let action: string;

	let show_validation_buttons = (data.author.email !== Global.user.email || Global.user.email === Global.user.manager) &&
								  (
									(Global.user.department !== "HR" && data.state === "En attente" && data.manager === null) ||
									(Global.user.department === "HR" && data.hr === null && data.manager !== null)
								  );

	async function validation(decision: string){

		if(decision === "Accept")
		{
			await Server.post('accept-request', {id: data.id}, {accept: true});
			data.state = "Validée";
		}
		else if (decision === "Refuse")
		{
			await Server.post('accept-request', {id: data.id}, {accept: false});
			data.state = "Refusée";
		}
		
		show_validation_buttons = false;
		update_color();		
	}
	
	let state_color = "";

	function update_color()
	{
		switch (data.state)
		{
			case "Brouillon":
				state_color = "#ADB1CC";
				break;

			case "En attente":
				state_color = "#E8A525";
				break;
			
			case "Validée":
				state_color = "#1DCF5A";
				break;
			
			case "Refusée":
				state_color = "#F62942";
				break;

			default:
				state_color = "#ADB1CC";
				break;
		}
	}
	update_color();

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
	{#if data.state !== "En attente" && data.state !== "Brouillon" && action !=="Consulter"}
		<div class="line">
			<span class="label">Décision :</span>
			<span class="value">{data.manager.first_name} {data.manager.last_name} {data.hr == null ? "" : ", " + data.hr.first_name + " " + data.hr.last_name}</span>
		</div>
	{/if}
	{#if data.type == "Télétravail"}
		<div class="line">
			<span class="label">Jours :</span>
			<span class="value">
				{#each data.remote as day, i}
					{day.day + (day.am && day.pm ? "" : (day.am ? " (matin)" : "") + (day.pm ? " (après-midi)" : "")) + (i < data.remote.length - 1 ? ", " : "")}
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
	{#if action !== "Consulter" && data.type === "Formation" || data.type === "Visite extérieure"}
		<div class="flex flex-row gap-4">
			<div class="line">
				<span class="label">Sujet :</span>
				<span class="value">{data.subject}</span>
			</div>
			<div class="line">
				<span class="label">Lieu :</span>
				<span class="value">{data.place}</span>
			</div>
		</div>
	{/if}
	{#if action !== "Consulter" && data.type === "Accident du travail"}
		<div class="line">
			<span class="label">Cause :</span>
			<span class="value">{data.cause}</span>
		</div>
	{/if}
	<div class="line {action == "Consulter" ? "mb-4" : ""}">
		<span class="label">Commentaire :</span>
		<span class="value">{data.comment == "" ? "(vide)" : data.comment}</span>
	</div>
	{#if action == "Consulter"}
		<a href="#/" class="button-a absolute">
			<button class="flex flex-row justify-center items-center gap-2" style="--color: {button_color}; --hover-color: {button_color_hover};"
					on:click={ async() => Global.displayed = data }>
				<img src={button_logo} alt="edit"/>
				<span>{action}</span>
			</button>
		</a>
	{:else if show_validation_buttons}
		<div class="flex flex-row gap-8 mx-auto">
			<a href="#/" >
				<button class="flex flex-row justify-center items-center gap-2" style="--color: {button_color}; --hover-color: {button_color_hover};"
						on:click={ () => validation("Accept") }>
					<img src={button_logo} alt="edit"/>
					<span>{action}</span>
				</button>
			</a>
			<a href="#/" >
				<button class="flex flex-row justify-center items-center gap-2" style="--color: #F62942; --hover-color: #c71f28;"
						on:click={ () => validation("Refuse") }>
					<img src={No} alt="edit"/>
					<span>Refuser</span>
				</button>
			</a>
		</div>	
	{/if}

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
