<script lang="ts">

	export let day_names;
	export let days;
	export let absences;
	export let is_month_mode;

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
		<section class="absence_section {absence.type}" style="grid-row: {absence.start_row}; grid-column: {absence.start_col} / span {absence.section_duration}; top: {absence.position * 25 - 5}px">
			<span class="absence_title">{absence.title}</span>
		</section>
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
