<script lang="ts">
    import Home from "../views/Home.svelte";

	export let update_card;
	export let public_holidays: Date[];
	export let days: any[];
	export let absences: any[];
	export let is_month_mode: boolean;

	const day_names = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

	function is_holiday(day)
	{
		if (day.date.getFullYear() != 2023)
			return false;

		for (let i = 0; i < public_holidays.length; i++)
		{
			if (day.date.getMonth() == public_holidays[i].getMonth() && day.date.getDate() == public_holidays[i].getDate())
			{
				return true;
			}
		}

		return false;
	}

</script>

<div class="calendar_content {is_month_mode ? "" : "week_mode"}">
	{#each day_names as day_name}
		<span class="day_name">{day_name}</span>
	{/each}

	{#each days as day}
		{#if day.this_month}
			<span class="day {is_month_mode ? "" : "week_mode"}">{(is_holiday(day) ? "(Férié) " : "") + day.name}</span>
		{:else}
			<span class="day {is_month_mode ? "" : "week_mode"} not_this_month">{day.name}</span>
		{/if}
	{/each}

	{#each absences as absence}
		{#if absence.shown}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<section class="absence_section {absence.type} {absence.selected ? "selected" : ""}" on:click={() => update_card(absence)} style="grid-row: {absence.start_row}; grid-column: {absence.start_col} / span {absence.section_duration}; top: {is_month_mode ? absence.position * 25 - 5 : absence.position * 25 - 195 }px">
				<span class="absence_title">{absence.title}</span>
			</section>
		{/if}
	{/each}
</div>

<style>
	.absence_section {
		border-left-width: 3px;
		border-left-style: solid;
		font-size: 10px bold;
		margin: 10px;
		position: relative;
		align-self: center;
		z-index: 2;

		cursor: pointer;

		border: 0;
		border-radius: 14px;
		color: white;
	}

	.conge {
		background: #0AD443;
	}

	.conge.selected {
		z-index: 3;
		border: solid;
		border-color: #06c63d;
		background: #12e74f;
	}

	.maladie {
		background: #F62942;
	}

	.maladie.selected {
		z-index: 3;
		border: solid;
		border-color: #ec1931;
		background: #ff5454;
	}

	.physique {
		background: #1640D4;
	}

	.physique.selected {
		z-index: 3;
		border: solid;
		border-color: #1032cb;
		background: #1e61e9;
	}

	.en_cours {
		background: #AEB4C3;
	}

	.en_cours.selected {
		z-index: 3;
		border: solid;
		border-color: #AEB4C3;
		background: #c3c9da;
	}

	.absence_title {
		font-size: 10px bold;
		overflow: hidden;
		white-space: nowrap;
	}

	.calendar_content {
		display: grid;
		grid-template-columns: repeat(7, minmax(120px, 1fr));
		grid-template-rows: 50px;
		grid-auto-rows: 120px;
	}

	.calendar_content.week_mode {
		display: grid;
		grid-template-columns: repeat(7, minmax(120px, 1fr));
		grid-template-rows: 50px;
		grid-auto-rows: 500px;
	}

	.day {
		border: 1px solid #C1CBDA;
		text-align: right;
		padding: 14px 20px;
		letter-spacing: 1px;
		font-size: 12px;
		box-sizing: border-box;
		color: #526581;
		position: relative;
		z-index: 1;
		padding-bottom: 87px;
	}

	.not_this_month {
		color: #D3DDE7;
	}

	.day:nth-of-type(n + 1):nth-of-type(-n + 7) {
		grid-row: 1;
	}
	.day:nth-of-type(n + 8):nth-of-type(-n + 14) {
		grid-row: 2;
	}
	.day:nth-of-type(n + 15):nth-of-type(-n + 21) {
		grid-row: 3;
	}
	.day:nth-of-type(n + 22):nth-of-type(-n + 28) {
		grid-row: 4;
	}
	.day:nth-of-type(n + 29):nth-of-type(-n + 35) {
		grid-row: 5;
	}
	.day:nth-of-type(n + 36):nth-of-type(-n + 42) {
		grid-row: 6;
	}
	.day:nth-of-type(n + 43):nth-of-type(-n + 59) {
		grid-row: 7;
	}
	.day:nth-of-type(7n + 1) {
		grid-column: 1/1;
		border-right: 0;
	}
	.day:nth-of-type(7n + 2) {
		grid-column: 2/2;
		border-right: 0;
	}
	.day:nth-of-type(7n + 3) {
		grid-column: 3/3;
		border-right: 0;
	}
	.day:nth-of-type(7n + 4) {
		grid-column: 4/4;
		border-right: 0;
	}
	.day:nth-of-type(7n + 5) {
		grid-column: 5/5;
		border-right: 0;
	}
	.day:nth-of-type(7n + 6) {
		grid-column: 6/6;
		border-right: 0;
	}
	.day:nth-of-type(7n + 7) {
		grid-column: 7/7;
	}

	.day.week_mode {
		height: 500px;
	}

	.day_name {
		font-size: 12px;
		text-transform: uppercase;
		color: white;
		background-color: #007AFF;
		text-align: center;
		border-bottom: 1px solid rgba(166, 168, 179, 0.12);
		line-height: 50px;
		font-weight: 500;
	}
</style>
