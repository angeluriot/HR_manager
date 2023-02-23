<script lang="ts">
	import Cross from "../../assets/shapes/Cross.svg";
	import type { NotificationData } from "../shared/types.js";
	import * as Server from "../shared/server.js";
	import Global from "../shared/Global.js";

	export let data: NotificationData;
	let shown = true;

	async function delete_notification()
	{
		try
		{
			await Server.post('delete-notification', { id: data.id }, {});
			shown = false;
			Global.nb_notifications--;
		}

		catch(err)
		{
			console.error(err);
		}
	}
</script>

<div id="card" class="flex flex-col justify-start items-start w-full rounded-3xl p-5 gap-2 relative {shown ? "" : "hidden"}">
	<header class="flex flex-row w-full justify-between mb-2">
		<h2>{data.text}</h2>
		<img src={Cross} alt="cross" on:click={delete_notification} on:keyup={delete_notification}/>
	</header>
	<div class="line">
		<span class="label">Type :</span>
		<span class="value">{data.request.type}</span>
	</div>
	<div class="flex flex-row gap-4">
		<div class="line">
			<span class="label">Début :</span>
			<span class="value">{data.request.start.day} {data.request.start.pm ? "(après-midi)" : "(matin)"}</span>
		</div>
		<div class="line">
			<span class="label">Fin :</span>
			<span class="value">{data.request.end.day} {data.request.end.pm ? "(après-midi)" : "(matin)"}</span>
		</div>
	</div>
</div>

<style>
	div, span
	{
		white-space: nowrap;
		text-decoration: none;
	}

	#card
	{
		box-shadow: 0px 6px 25px rgb(193, 195, 206);
		max-width: 550px;
	}

	h2
	{
		font-family: "Nunito-Bold";
		font-size: 20px;
		color: #09244B;
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

	img
	{
		margin: -5px;
		padding: 5px;
		cursor: pointer;
		width: 40px;
		height: 40px;
	}
</style>
