<script lang="ts">
    import { TestimonialPlaceholder } from "flowbite-svelte";
	import Calendar from "../components/Calendar.svelte";

	var days = [];
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth();

	let month_names = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

	var is_month_mode = true;

	$:month, year, update_calendar();

	var raw_absences = [
		{title: "A. Didot (RTT)", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), duration: 3, section_duration: 3, start_row: 0, start_col: 0, position: -1, type: "conge"},
		{title: "C. Moray (AM)", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "maladie"},
		{title: "T. Truc (AM)", date: new Date(2023, 0, 5), section_date: new Date(2023, 0, 5), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "maladie"},
		{title: "T. Truc2 (T)", date: new Date(2023, 0, 4), section_date: new Date(2023, 0, 4), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "physique"},
		{title: "T. Truc4 (T)", date: new Date(2023, 1, 1), section_date: new Date(2023, 1, 1), duration: 30, section_duration: 30, start_row: 0, start_col: 0, position: -1, type: "physique"},
		{title: "T. Truc3 (T)", date: new Date(2023, 0, 11), section_date: new Date(2023, 0, 11), duration: 7, section_duration: 7, start_row: 0, start_col: 0, position: -1, type: "physique"}
	];

	var absences_week = [];
	var absences_week_month = [];
	var absences = [];

	init_calendar();

	// Initialize all the calendar sections
	function init_calendar()
	{
		// Split all absences into sub-absences to display the sections correctly
		for (let absence of raw_absences)
		{
			let current_duration = absence.duration;
			let this_section_duration;

			if (absence.section_date.getDay() == 0)
				absence.section_date = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + 1);

			else if (absence.section_date.getDay() == 6)
				absence.section_date = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + 2);

			let this_section_date = absence.section_date;

			// Split into sub-absences if the sub-absence is longer than a week
			if (current_duration > 6 - this_section_date.getDay())
			{
				while (current_duration > 6 - this_section_date.getDay())
				{
					this_section_duration = 6 - this_section_date.getDay();
					current_duration -= this_section_duration;

					absences_week.push({title: absence.title, date: absence.date, section_date: this_section_date, duration: absence.duration, section_duration: this_section_duration, start_row: 0, start_col: 0, position: -1, type: absence.type});
					this_section_date = new Date(this_section_date.getFullYear(), this_section_date.getMonth(), this_section_date.getDate() + 8 - this_section_date.getDay());
				}

				absences_week.push({title: absence.title, date: absence.date, section_date: this_section_date, duration: absence.duration, section_duration: current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type});
			}

			else
				absences_week.push(absence);
		}

		// Split into sub-absences if the sub-absence is longer than a month
		for (let absence of absences_week)
		{
			if (absence.section_duration + absence.section_date.getDate() > new Date(absence.section_date.getFullYear(), absence.section_date.getMonth() + 1, 0).getDate() + 1)
			{
				let current_duration = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth() + 1, 0).getDate() - absence.section_date.getDate() + 1;
				absences_week_month.push({title: absence.title, date: absence.date, section_date: absence.section_date, duration: absence.duration, section_duration: current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type});
				absences_week_month.push({title: absence.title, date: absence.date, section_date: new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + current_duration), duration: absence.duration, section_duration: absence.section_duration - current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type});
			}

			else
				absences_week_month.push(absence);
		}

		//for (let absence of absences_week_month)
			//console.log(absence.title + " " + absence.section_duration + " " + absence.section_date);
	}

	// Update calendar when month is changed
	function update_calendar()
	{
		days = [];
		absences = [];

		var first_day = new Date(year, month, 0).getDay();
		var days_in_this_month = new Date(year, month + 1, 0).getDate();
		var days_in_last_month = new Date(year, month, 0).getDate();
		var prev_month = month == 0 ? 11 : month - 1;

		// Days from previous month (same week as the first)
		for (let i = days_in_last_month - first_day; i < days_in_last_month; i++)
		{
			let d = new Date(prev_month == 11 ? year - 1 : year, prev_month, i + 1);
			days.push({name: '' + (i + 1), this_month: false, date: d});
		}

		// Days from this month
		for (let i = 0; i < days_in_this_month; i++)
		{
			let d = new Date(year, month, i + 1);
			days.push({name: '' + (i + 1), this_month: true, date: d});
		}

		// Days from last month (same week as the last)
		for (let i = 0; days.length % 7; i++)
		{
			let d = new Date((month == 11 ? year + 1 : year), (month + 1) % 12, i + 1);
			days.push({name: ' ' + (i + 1), this_month: false, date: d});
		}

		// Compute the correct rows and columns of the calendar to display each section
		for (let absence of absences_week_month)
		{
			if (absence.section_date.getFullYear() == year && absence.section_date.getMonth() == month)
			{
				absence.start_row = Math.floor((absence.section_date.getDate() + first_day - 1) / 7) + 2;
				absence.start_col = (absence.section_date.getDate() + first_day - 1) % 7 + 1;

				absences.push(absence);
			}
		}

		// Get a position for each section to avoid overlay
		for (let a of absences)
		{
			let i = 0;
			let position_found = false;

			while (!(position_found) && i < 3)
			{
				let position_ok = true;
				for (let b of absences)
				{
					if (a.title != b.title && b.position == i && are_overlayed(a.section_date.getDate(), a.duration, b.section_date.getDate(), b.duration))
					{
						position_ok = false;
						break;
					}
				}

				if (position_ok)
				{
					position_found = true;
					a.position = i;
				}

				i++;
			}
		}
	}

	function are_overlayed(date1: number, duration1: number, date2: number, duration2: number)
	{
		if (date1 < date2)
			return duration1 > date2 - date1;

		return duration2 > date1 - date2;
	}

	function left()
	{
		if (month==0)
		{
			month=11;
			year--;
		}
		else
			month--;
	}

	function right()
	{
		if (month == 11)
		{
			month = 0;
			year++;
		}
		else
			month++;
	}

	function week_mode()
	{
		if (!is_month_mode)
			return;

		is_month_mode = false;

		let week_mode_button = document.getElementById("week_mode_button");
		let month_mode_button = document.getElementById("month_mode_button");

		week_mode_button.classList.remove("mode_button");
		week_mode_button.classList.toggle("mode_button_checked");
		month_mode_button.classList.remove("mode_button_checked");
		month_mode_button.classList.toggle("mode_button");

		week_mode_button.style.left = "10px";
		month_mode_button.style.left = "125px";
	}

	function month_mode()
	{
		if (is_month_mode)
			return;

		is_month_mode = true;

		let week_mode_button = document.getElementById("week_mode_button");
		let month_mode_button = document.getElementById("month_mode_button");

		week_mode_button.classList.remove("mode_button_checked");
		week_mode_button.classList.toggle("mode_button");
		month_mode_button.classList.remove("mode_button");
		month_mode_button.classList.toggle("mode_button_checked");
		week_mode_button.style.left = "20px";
		month_mode_button.style.left = "115px";
	}

</script>

<div id="container" class="main gap-10">
	<div class="calendar">
		<div class="calendar_header">
			<input type="button" on:click={() => week_mode()} class="mode_button" id="week_mode_button" value="Semaines">
			<input type="button" on:click={() => month_mode()} class="mode_button_checked" id="month_mode_button" value="Mois">

			<button class="months_button" on:click={() => left()}>&lt;</button>
			<h1 id="titre">{month_names[month] + ' ' + year}</h1>
			<button class="months_button" on:click={() => right()}>&gt;</button>
			<span id="days_info">Nombre de jours de congé : 0 </span>
		</div>
		<Calendar day_names = {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]} {days} {absences}/>
	</div>
</div>

<style>
	.calendar {
		width: 100%;
		height: 95%;
		margin: auto;
		overflow: hidden;
		border-radius: 10px;
		max-width: 1200px;
	}

	.calendar_header {
		display: flex;
		flex-direction: row;
		text-align: center;
		border-bottom: 1px solid rgba(166, 168, 179, 0.12);
		padding: 30px 0;
	}

	.mode_button {
		position: absolute;
		font-size: 20px;

		color: black;
		cursor: pointer;
	}

	.mode_button_checked {
		position: absolute;
		font-size: 20px;

		color: white;
		background: #007AFF;
		border-radius: 14px;
		padding-left: 10px;
		padding-right: 10px;
		cursor: pointer;
	}

	.months_button {
		border: 1px;
		padding-left: 7px;
		padding-right: 10px;
		cursor: pointer;
	}

	.calendar_header h1 {
		font-size: 25px;
	}

	#container {
		position: relative;
		flex-direction: column;
		display: flex;
		height: 100vh;
		margin-left: 300px;
	}

	#month_mode_button {
		left: 125px;
	}

	#week_mode_button {
		left: 20px;
	}

	#days_info {
		position: absolute;
		right: 2%;
		font-size: 20px;
	}

	#titre {
		color: #09244B;
	}
</style>
