<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { onMount } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Server from "../shared/server.js";

	let unique = {};

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

		else
		{
			await Server.update_info();
			restart();
		}
	});

	let points: any = [
		{ year: 1990, birthrate: 16.7 },
		{ year: 1995, birthrate: 14.6 },
		{ year: 2000, birthrate: 14.4 },
		{ year: 2005, birthrate: 14 },
		{ year: 2010, birthrate: 13 },
		{ year: 2015, birthrate: 12.4 }
	];

	const xTicks = [1990, 1995, 2000, 2005, 2010, 2015];
	const yTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;

	function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

	$: xScale = scaleLinear()
		.domain([0, chartXLabels.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = 30;

	let selectStatisticType = ["Taux d'arrêt maladie", "Taux d'accident du travail", "Taux de télétravail", "Taux de présence sur site"];
	let selectTimePeriod = ["Par jour de la semaine", "Par semaine", "Par mois", "Par année"];
	let selectCollaborators = ["Service 1", "Service 2", "Collaborateur 1", "Collaborateur 2"];

	let chartXLabels = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
	let activeStat = "";
	let activePeriod = "";
	let activeCollab = "";

	function changeTimePeriod() {
		if(activePeriod === "Par jour de la semaine") {
			chartXLabels = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
			points = [
				{ x: "Lundi", y: 16.7 },
				{ x: "Mardi", y: 14.6 },
				{ x: "Mercredi", y: 14.4 },
				{ x: "Jeudi", y: 14 },
				{ x: "Vendredi", y: 13 },
				{ x: "Samedi", y: 12.4 },
				{ x: "Dimanche", y: 12.4 }
			];
		}
		else if(activePeriod === "Par semaine") {
			chartXLabels = ["Semaine 1", "Semaine 2"]
			points = [
				{ x: "Semaine 1", y: 56.7 },
				{ x: "Semaine 2", y: 54.6 }
			];
		}
		else if(activePeriod === "Par mois") {
			chartXLabels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
			points = [
				{ x: "Janvier", y: 16.7 },
				{ x: "Février", y: 14.6 },
				{ x: "Mars", y: 14.4 },
				{ x: "Avril", y: 14 },
				{ x: "Mai", y: 13 },
				{ x: "Juin", y: 12.4 },
				{ x: "Juillet", y: 62.4 },
				{ x: "Août", y: 52.4 },
				{ x: "Septembre", y: 42.4 },
				{ x: "Octobre", y: 32.4 },
				{ x: "Novembre", y: 22.4 },
				{ x: "Décembre", y: 2.4 }
			];
		}
		else if(activePeriod === "Par année") {
			chartXLabels = ["2023", "2024", "2025", "2026"]
			points = [
				{ x: 2023, y: 16.7 },
				{ x: 2024, y: 14.6 },
				{ x: 2025, y: 14.4 },
				{ x: 2026, y: 14 }
			];
		}
	}
</script>

{#key unique}
	<Menu active="Statistiques"/>
	<div class="main gap-10 w-full">
		<h1>Statistiques</h1>
		<div class="flex flex-row gap-6">
			<select bind:value={activeStat}>
				<option value="" disabled selected>-- Type de Statistiques --</option>
				{#each selectStatisticType as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
			<select bind:value={activePeriod} on:change={changeTimePeriod}>
				<option value="" disabled selected>-- Période --</option>
				{#each selectTimePeriod as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
			<select bind:value={activeCollab}>
				<option value="" disabled selected>-- Services et Collaborateurs --</option>
				{#each selectCollaborators as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		<h2>{(activeStat === "" ? "-- Sélectionnez une statistique --" : activeStat + " " + activePeriod)}</h2>

		<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
			<svg>
				<!-- y axis -->
				<g class="axis y-axis">
					{#each yTicks as tick}
						<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
							<line x2="100%"></line>
							<text y="-4">{tick} %</text>
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
	select {
		width: 300px;
		height: 30px;
		padding: 2px 8px;
		display: inline-block;
		border: 2px solid #007AFF;
		border-radius: 4px;
		box-sizing: border-box;
	}

	h2 {
		text-align: center;
	}
	.chart {
		width: 95%;
		margin: 0 auto;
	}

	svg {
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
</style>
