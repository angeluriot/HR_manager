<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Server from "../shared/server.js";
	import * as Utils from "../shared/utils.js";

	let now = new Date();
	let current_day = now.getDay();
	let current_date: number  = now.getDate();
	let current_month: number = now.getMonth();
	let current_year: number = now.getFullYear();

	const months_list = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
	const days_list = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

	let work_accident_requests = []
	let sickness_requests = []
	let remote_work_requests = []
	let users = []

	let unique = {};

	let dpt_filter = []
	let dpt_list = []

	function restart()
	{
		unique = {}
	}

	onMount(async () =>
	{
		if (!Global.user)
		{
			await Server.auto_login();
			restart();
		}

		try
		{
			work_accident_requests = await Server.get('work-accident-requests');
			sickness_requests = await Server.get('sickness-requests');
			remote_work_requests = await Server.get('remote-work-requests');

			users = await Server.get('users');

			dpt_filter["RH"] = [];

			for(let i = 0; i < users.length; i++) {
				if(users[i].email === undefined)
					continue;

				if(dpt_filter[users[i].email] == null)
					dpt_filter[users[i].email] = [];

				dpt_filter[users[i].email].push(users[i].first_name + " " + users[i].last_name);

				if(dpt_filter[users[i].manager] == null)
					dpt_filter[users[i].manager] = [];

				if(dpt_filter[users[i].manager].indexOf(users[i].department) == -1)
					dpt_filter[users[i].manager].push(users[i].department);

				if(dpt_filter["RH"].indexOf(users[i].department) == -1)
					dpt_filter["RH"].push(users[i].department);

				if(dpt_list[users[i].department] == null)
					dpt_list[users[i].department] = [];

				dpt_list[users[i].department].push(users[i].first_name + " " + users[i].last_name);
			}

			if(Global.user.department === "RH")
				selectCollaborators = dpt_filter["RH"];
			else
				selectCollaborators = dpt_filter[Global.user.email];

			let nbDpt = selectCollaborators.length;

			for(let i = 0; i < nbDpt; i++) {
				let collab = selectCollaborators[i];
				if(dpt_list[collab] != null)
					for(let j = 0; j < dpt_list[collab].length; j++) {
						let dpt = dpt_list[collab][j];
						let idx = selectCollaborators.indexOf(dpt);
						if(idx >= 0)
							dpt = selectCollaborators.splice(idx, 1);
						selectCollaborators.push(dpt);
					}
			}
		} catch (err) {
			console.error(err)
		}

		updateGraph();
	});

	let points: any = []
	let xTicks = [];
	let yTicks = [];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;

	function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

	$: xScale = scaleLinear()
		.domain([0, points.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = 30;

	let selectStatisticType = ["Taux d'arrêt maladie", "Taux d'accident du travail", "Taux de télétravail"];
	let selectTimePeriod = ["Par jour de la semaine", "Par semaine", "Par mois", "Par année"];
	let selectCollaborators = [];

	let activeStat = "Taux d'arrêt maladie";
	let activePeriod = "Par jour de la semaine";
	let activeCollab = "Toute l'entreprise";

	function isInDpt(dpt: string, author: any) {
		let name = author.first_name + " " + author.last_name;
		return dpt === "Toute l'entreprise" || (dpt_list[dpt] != null && dpt_list[dpt].indexOf(name) >= 0) || dpt === name;
	}

	function updateGraph() {
		let request;
		switch(activeStat) {
			case "Taux d'arrêt maladie": request = sickness_requests; break;
			case "Taux d'accident du travail": request = work_accident_requests; break;
			case "Taux de télétravail": request = remote_work_requests; break;
			default : return;
		}

		if(activePeriod === "Par jour de la semaine") {
			let histo = [0, 0, 0, 0, 0, 0, 0];
			for(let i = 0; i < request.length; i++) {
				console.log(request[i].author);
				if(!isInDpt(activeCollab, request[i].author))
					continue;

				let req_date_end = Utils.string_to_date(request[i].end.day);
				for(let req_date = Utils.string_to_date(request[i].start.day); req_date.getTime() <= req_date_end.getTime(); req_date.setDate(req_date.getDate() +1))
					histo[(req_date.getDay() + 6)%7]++;
			}

			points = [];
			for(let i = 0; i < 7; i++)
				points.push({ x: days_list[i], y: histo[i] });
		}
		else if(activePeriod === "Par semaine") {
			let date_start = Utils.string_to_date("01/" + (current_month < 9 ? "0" : "") + (current_month+1) + "/" + current_year);
			date_start.setDate(date_start.getDate() - date_start.getDay() + 1);
			let date_start_string = (date_start.getDate() < 10 ? "0" : "") + (date_start.getDate()) + "/" + (date_start.getMonth() < 10 ? "0" : "") + (date_start.getMonth()+1) + "/" + date_start.getFullYear();
			let date_end = Utils.string_to_date(date_start_string);

			let next_month = Utils.string_to_date("01/" + (current_month < 8 ? "0" : "") + (current_month+2) + "/" + current_year);

			date_end.setDate(date_end.getDate() + 7);
			date_end.setSeconds(date_end.getSeconds() - 1);
			let date_end_string = (date_end.getDate() < 10 ? "0" : "") + (date_end.getDate()) + "/" + (date_end.getMonth() < 10 ? "0" : "") + (date_end.getMonth()+1) + "/" + date_end.getFullYear();
			points = [];
			let histo = [];

			let max = 0;

			while(date_start.getTime() <= next_month.getTime()) {
				histo.push(0);
				for(let i = 0; i < request.length; i++) {
					if(!isInDpt(activeCollab, request[i].author))
						continue;

					let req_date_end = Utils.string_to_date(request[i].end.day);
					for(let req_date = Utils.string_to_date(request[i].start.day); req_date.getTime() <= req_date_end.getTime(); req_date.setDate(req_date.getDate() +1))
						if(date_start.getTime() <= req_date.getTime() && req_date.getTime() < date_end.getTime()) {
							histo[points.length]++;
							if(histo[points.length] > max)
								max = histo[points.length];
						}
				}

				points.push({ x: (date_start_string.substr(0, 5) + " - " + date_end_string.substr(0, 5)), y: histo[points.length] });
				date_start.setDate(date_start.getDate() + 7);
				date_end.setDate(date_end.getDate() + 7);
				date_end_string = (date_end.getDate() < 10 ? "0" : "") + (date_end.getDate()) + "/" + (date_end.getMonth() < 10 ? "0" : "") + (date_end.getMonth()+1) + "/" + date_end.getFullYear()
				date_start_string = (date_start.getDate() < 10 ? "0" : "") + (date_start.getDate()) + "/" + (date_start.getMonth() < 10 ? "0" : "") + (date_start.getMonth()+1) + "/" + date_start.getFullYear();
			}
		}
		else if(activePeriod === "Par mois") {
			let histo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for(let i = 0; i < request.length; i++) {
				if(!isInDpt(activeCollab, request[i].author))
					continue;

				let req_date_end = Utils.string_to_date(request[i].end.day);
				for(let req_date = Utils.string_to_date(request[i].start.day); req_date.getTime() <= req_date_end.getTime(); req_date.setDate(req_date.getDate() +1))
				{
					if(req_date.getFullYear() === current_year)
						histo[req_date.getMonth()]++;
				}
			}

			points = [];
			for(let i = 0; i < 12; i++)
				points.push({ x: months_list[i], y: histo[i] });
		}
		else if(activePeriod === "Par année") {
			points = [];
			for(let i = 0; i < request.length; i++) {
				if(!isInDpt(activeCollab, request[i].author))
					continue;

				let req_date_end = Utils.string_to_date(request[i].end.day);
				for(let req_date = Utils.string_to_date(request[i].start.day); req_date.getTime() <= req_date_end.getTime(); req_date.setDate(req_date.getDate() +1)) {
					let p = 0;
					for(; p < points.length; p++)
						if(parseInt(points[p].x, 10) === req_date.getFullYear()) {
							points[p].y++;
							break;
						}

					if(p == points.length)
						points.push({x : (req_date.getFullYear()).toString(), y : 1});
				}
			}

			points.sort((a, b) => a.x - b.x);
		}

		yTicks = [0];
		for(let i = 0; i < points.length; i++)
			yTicks.push(points[i].y);
	}

	function goBackMonth() {
		if(current_month <= 0)
			current_year--;

		current_month = (current_month + 11)%12;
		updateGraph();
	}

	function goFurtherMonth() {
		if(current_month >= 11)
			current_year++;

		current_month = (current_month + 1)%12;
		updateGraph();
	}

	function goBackYear() {
		current_year--;
		updateGraph();
	}

	function goFurtherYear() {
		current_year++;
		updateGraph();
	}
</script>

{#key unique}
	<Menu active="Statistiques"/>
	<div class="main gap-14 w-full flex h-full flex-col justify-start mt-[200px]">
		<h1 class="title mb-5">Statistiques</h1>
		<div class="flex flex-row gap-12">
			<div class="input-container enabled flex relative w-[350px]">
				<select bind:value={activeStat} on:change={updateGraph}>
					{#each selectStatisticType as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
				<span>Choix de la statistique</span>
				<svg width=24 height=24 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17 10L12 15L7 10L17 10Z"/>
				</svg>
			</div>
			<div class="input-container enabled flex relative w-[350px]">
				<select bind:value={activePeriod} on:change={updateGraph}>
					{#each selectTimePeriod as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
				<span>Choix de la période</span>
				<svg width=24 height=24 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17 10L12 15L7 10L17 10Z"/>
				</svg>
			</div>
			<div class="input-container enabled flex relative w-[350px]">
				<select bind:value={activeCollab} on:change={updateGraph}>
					<option value="Toute l'entreprise" selected>Toute l'entreprise</option>
					{#each selectCollaborators as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
				<span>Choix du collaborateur ou du service</span>
				<svg width=24 height=24 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17 10L12 15L7 10L17 10Z"/>
				</svg>
			</div>
		</div>
		<div class="flex flex-row gap-6">
			{#if activePeriod === "Par semaine"}
				<button class="months_button" on:click={() => goBackMonth()}>&lt;</button>
				<h1 id="titre">{months_list[current_month]} {current_year}</h1>
				<button class="months_button" on:click={() => goFurtherMonth()}>&gt;</button>
			{/if}
			{#if activePeriod === "Par mois"}
				<button class="months_button" on:click={() => goBackYear()}>&lt;</button>
				<h1 id="titre">{current_year}</h1>
				<button class="months_button" on:click={() => goFurtherYear()}>&gt;</button>
			{/if}
		</div>
		<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
			<svg>
				<!-- y axis -->
				<g class="axis y-axis">
					{#each yTicks as tick}
						<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
							<line x2="100%"></line>
							<text y="-4">{tick}</text>
						</g>
					{/each}
				</g>

				<!-- x axis -->
				<g class="axis x-axis">
					{#each points as point, i}
						<g class="tick" transform="translate({xScale(i)},{height})">
							<text x="{barWidth/2}" y="-4">{width > 380 ? point.x : formatMobile(point.x)}</text>
						</g>
					{/each}
				</g>

				<g class='bars'>
					{#each points as point, i}
						<rect
							x="{xScale(i) + 2}"
							y="{yScale(point.y)}"
							width="{barWidth - 4}"
							height="{yScale(0) - yScale(point.y)}"
						></rect>
					{/each}
				</g>
			</svg>
		</div>
	</div>
{/key}

<style>

	h1.title
	{
		font-size: 35px;
	}

	h1, button
	{
		font-family: "Nunito-Bold";
		font-size: 27px;
		color: #09244B;
	}

	select {
		width: 300px;
		height: 55px;
		padding: 2px 8px;
		display: inline-block;
		border: 2px solid #007AFF;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.chart {
		width: 95%;
		margin: 0 auto;
	}

	.chart svg {
		position: relative;
		width: 95%;
		height: 400px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: .725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e2;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #ccc;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.bars rect {
		fill: #08f;
		stroke: none;
		opacity: 0.85;
	}

	.input-container.disabled
	{
		pointer-events: none;
	}

	.input-container select, .input-container input
	{
		border: 2px solid #6D6E7A;
		padding: 13px 17px 11px 17px;
		border-radius: 5px;
		font-family: "Roboto-Regular";
		font-size: 17px;
		appearance: none;
		-moz-appearance: none;
		text-align: left;
		width: 100%;
		background-color: white;
	}

	.input-container.disabled select, .input-container.disabled input
	{
		border: 2px solid #E4E5ED;
		color: #9092A6;
	}

	.input-container select
	{
		outline: none;
		cursor: pointer;
		user-select: none;
	}

	.input-container.enabled select:focus, .input-container.enabled input:focus
	{
		outline: none;
		border: 2px solid #007AFF;
	}

	.input-container option
	{
		font: "Roboto-Regular" sans-serif;
		font-size: 17px;
		text-align: left;
	}

	.input-container span
	{
		pointer-events: none;
		position: absolute;
		top: -6px;
		left: 10px;
		font-family: "Roboto-Medium";
		color: #6D6E7A;
		font-size: 14px;
		line-height: 14px;
		background-color: white;
		padding: 0px 4px 0px 4px;
	}

	.input-container.disabled span
	{
		color: #9092A6;
		font-family: "Roboto-Regular";
	}

	.input-container.enabled:focus-within span
	{
		color: #007AFF;
	}

	.input-container svg
	{
		cursor: pointer;
		position: absolute;
		right: 12px;
		fill: #6D6E7A;
		pointer-events: none;
	}

	.input-container.enabled:focus-within svg
	{
		fill: #007AFF;
	}

	.input-container.invalid input
	{
		border: 2px solid #ff3a305e;
		color: #ff3a30a3;
	}

	.input-container.invalid span
	{
		color: #ff3a30a3;
	}
</style>
