<script lang="ts">
	import Edit from "../../assets/shapes/Edit.svg"
	import Global from "../shared/Global"
	import * as Server from "../shared/server"
	import type { NotificationData, RequestData } from "../shared/types.js";

	export let data: NotificationData;
    let request : RequestData;

    async function onMount() {
        try
		{
			request = await Server.get('request-id', { id: data.request });
		}

		catch(err)
		{
			console.error(err);
		}
    }

    onMount();

</script>

{#if request}
    <div id="card" class="flex flex-col justify-start items-start w-full rounded-3xl p-5 gap-2 relative">
        <header class="flex flex-row w-full justify-between mb-2">
            <h2>{data.text}</h2>
            <a href="#/requests" class="button-a ml-auto">
                <button class="flex flex-row justify-center items-center gap-2" style="--color: #007AFF ; --hover-color: #0062CC;">
                    <img src={Edit} alt="edit"/>
                    <span>Consulter</span>
                </button>
            </a>
        </header>
        <div class="line">
            <span class="label">Type :</span>
            <span class="value">{request.type}</span>
        </div>
        <div class="flex flex-row gap-4">
            <div class="line">
                <span class="label">Début :</span>
                <span class="value">{request.start.day} {request.start.pm ? "(après-midi)" : "(matin)"}</span>
            </div>
            <div class="line">
                <span class="label">Fin :</span>
                <span class="value">{request.end.day} {request.end.pm ? "(après-midi)" : "(matin)"}</span>
            </div>
        </div>
    </div>
{/if}

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
