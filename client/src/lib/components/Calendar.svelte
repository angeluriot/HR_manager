<script lang="ts">

	export let days: any[];
	export let absences: any[];
	export let is_month_mode: boolean;

	const day_names = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

	function show_popup_info(absence)
	{
		var popup = document.getElementById("info_popup");
		document.getElementById("info_popup_close").style.visibility = "visible";
		popup.style.visibility = "visible";
		popup.textContent = "test";
	}

	function hide_popup_info()
	{
		document.getElementById("info_popup").style.visibility = "hidden";
		document.getElementById("info_popup_close").style.visibility = "hidden";
	}

</script>

<div class="calendar_content">
	{#each day_names as day_name}
		<span class="day_name">{day_name}</span>
	{/each}

	{#each days as day}
		{#if day.this_month}
			<span class="day">{day.name}</span>
		{:else}
			<span class="day not_this_month">{day.name}</span>
		{/if}
	{/each}

	{#each absences as absence}
		{#if absence.shown}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<section class="absence_section {absence.type}" on:click={() => show_popup_info(absence)} style="grid-row: {absence.start_row}; grid-column: {absence.start_col} / span {absence.section_duration}; top: {absence.position * 25 - 5}px">
				<span class="absence_title">{absence.title}</span>
			</section>
		{/if}
	{/each}

	<div class="popup_box">
		<span class="popup" id="info_popup">test</span>
		<button class="btn_close_popup" id="info_popup_close" on:click={() => hide_popup_info()}>X</button>
	</div>
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

		border: 0;
		border-radius: 14px;
		color: white;
	}

	.conge {
		background: #0AD443;
	}

	.maladie {
		background: #F62942;
	}

	.physique {
		background: #1640D4;
	}

	.absence_section

	.absence_title {
		font-size: 10px bold;
	}

	.calendar_content {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-columns: repeat(7, minmax(120px, 1fr));
		grid-template-rows: 50px;
		grid-auto-rows: 120px;
		overflow: auto;
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
		padding-bottom: 87px; 					/* ADAPTER !!! */
	}

	.not_this_month {
		color: #D3DDE7;
	}

	.popup_box {
		position: absolute;
		z-index: 2;
		padding: 8px 0;
		left: 80%;
	}

	.popup {
		position: relative;
		visibility: hidden;
		width: 240px;
		height: 240px;
		border: 1px solid black;
		color: black;
		background-color: white;
		text-align: center;
		border-radius: 6px;
	}

	.btn_close_popup {
		visibility: hidden;
		position: absolute;
		padding-left: 210px;
		padding-bottom: 210px;
	}

	.day:nth-of-type(n + 1):nth-of-type(-n + 7) {
		grid-row: 1;
		border-bottom: 0;
	}
	.day:nth-of-type(n + 8):nth-of-type(-n + 14) {
		grid-row: 2;
		border-bottom: 0;
	}
	.day:nth-of-type(n + 15):nth-of-type(-n + 21) {
		grid-row: 3;
		border-bottom: 0;
	}
	.day:nth-of-type(n + 22):nth-of-type(-n + 28) {
		grid-row: 4;
		border-bottom: 0;
	}
	.day:nth-of-type(n + 29):nth-of-type(-n + 35) {
		grid-row: 5;
		border-bottom: 0;
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
