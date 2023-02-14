<script lang="ts">
	import Calendar from "../components/Calendar.svelte";
	import RequestCard from "../components/RequestCard.svelte";
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
	});

	let showRequest = false;

	let days = [];
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth();
	let day = now.getDate();
	let day_of_the_week = now.getDay();
	let this_monday: number;

	if (day - day_of_the_week > 0)
		this_monday = day - day_of_the_week;
	else
		this_monday = day - day_of_the_week + new Date(year, month, 0).getDate();

	let month_names = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

	let is_month_mode = true;

	$:is_month_mode, this_monday, month, year, update_calendar();

	let raw_absences = [
		{title: "A. Didot (RTT)", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), duration: 3, section_duration: 3, start_row: 0, start_col: 0, position: -1, type: "conge", shown: true},
		{title: "C. Moray (AM)", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "maladie", shown: true},
		{title: "D. Hopol (AM)", date: new Date(2023, 0, 5), section_date: new Date(2023, 0, 5), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "maladie", shown: true},
		{title: "A. Bertrand (T)", date: new Date(2023, 0, 4), section_date: new Date(2023, 0, 4), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "physique", shown: true},
		{title: "E. Tessier (T)", date: new Date(2023, 0, 30), section_date: new Date(2023, 0, 30), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "physique", shown: true},
		{title: "F. Guilbault (T)", date: new Date(2023, 0, 11), section_date: new Date(2023, 0, 11), duration: 7, section_duration: 7, start_row: 0, start_col: 0, position: -1, type: "physique", shown: true},
		{title: "G. Evian (T)", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), duration: 3, section_duration: 3, start_row: 0, start_col: 0, position: -1, type: "physique", shown: true}
	];

	let absences_week = [];
	let absences_week_month = [];
	let absences = [];

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

					absences_week.push({title: absence.title, date: absence.date, section_date: this_section_date, duration: absence.duration, section_duration: this_section_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, shown: true});
					this_section_date = new Date(this_section_date.getFullYear(), this_section_date.getMonth(), this_section_date.getDate() + 8 - this_section_date.getDay());
				}

				absences_week.push({title: absence.title, date: absence.date, section_date: this_section_date, duration: absence.duration, section_duration: current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, shown: true});
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
				absences_week_month.push({title: absence.title, date: absence.date, section_date: absence.section_date, duration: absence.duration, section_duration: current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, shown: true});
				absences_week_month.push({title: absence.title, date: absence.date, section_date: new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + current_duration), duration: absence.duration, section_duration: absence.section_duration - current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, shown: true});
			}

			else
				absences_week_month.push(absence);
		}
	}

	// Update calendar when month is changed
	function update_calendar()
	{
		days = [];
		absences = [];

		let first_day = new Date(year, month, 0).getDay();
		let days_in_this_month = new Date(year, month + 1, 0).getDate();
		let days_in_last_month = new Date(year, month, 0).getDate();
		let prev_month = month == 0 ? 11 : month - 1;

		if (is_month_mode)
		{
			// Days from previous month (same week as the first)
			for (let i = days_in_last_month - first_day; i < days_in_last_month; i++)
				days.push({name: '' + (i + 1), this_month: false, date: new Date(prev_month == 11 ? year - 1 : year, prev_month, i + 1)});

			// Days from this month
			for (let i = 0; i < days_in_this_month; i++)
				days.push({name: '' + (i + 1), this_month: true, date: new Date(year, month, i + 1)});

			// Days from last month (same week as the last)
			for (let i = 0; days.length % 7; i++)
				days.push({name: ' ' + (i + 1), this_month: false, date: new Date((month == 11 ? year + 1 : year), (month + 1) % 12, i + 1)});
		}

		else
		{
			for (let i = 1; i < 8; i++)
			{
				if (this_monday + i <= days_in_this_month)
					days.push({name: ' ' + (this_monday + i), this_month: true, date: new Date(year, month, this_monday + i)});

				else
					days.push({name: ' ' + (this_monday + i - days_in_this_month), this_month: true, date: new Date(year, month, this_monday + i - days_in_this_month)});
			}
		}

		// Compute the correct rows and columns of the calendar to display each section
		for (let absence of absences_week_month)
		{
			if (is_month_mode && absence.section_date.getFullYear() == year && absence.section_date.getMonth() == month)
			{
				absence.start_row = Math.floor((absence.section_date.getDate() + first_day - 1) / 7) + 2;
				absence.start_col = (absence.section_date.getDate() + first_day - 1) % 7 + 1;

				absences.push(absence);
			}

			else if (!is_month_mode && absence.section_date.getFullYear() == year && absence.section_date.getMonth() == month
						&& absence.section_date.getDate() > this_monday && absence.section_date.getDate() < this_monday + 5)
			{
				absence.start_row = 2;
				absence.start_col = (absence.section_date.getDate() - this_monday - 1) % 7 + 1;

				absences.push(absence);
			}
		}

		// Get a position for each section to avoid overlay
		for (let a of absences)
		{
			let i = 0;
			let position_found = false;
			a.shown = true;

			while (!(position_found))
			{
				if (i > 2 && is_month_mode)
				{
					a.shown = false;
					position_found = true;
					break;
				}

				else
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
	}

	function are_overlayed(date1: number, duration1: number, date2: number, duration2: number)
	{
		if (date1 < date2)
			return duration1 > date2 - date1;

		return duration2 > date1 - date2;
	}

	function left()
	{
		let days_in_last_month = new Date(year, month, 0).getDate();

		if (is_month_mode)
		{
			if (month == 0)
			{
				month = 11;
				year--;
			}
			else
				month--;

			this_monday += days_in_last_month;
			while (this_monday > 6)
				this_monday -= 7;
		}
		else
		{
			this_monday -= 7;

			if (this_monday < 0)
			{
				if (month == 0)
				{
					month = 11;
					year--;
				}
				else
					month--;

				this_monday += days_in_last_month;
			}
		}
	}

	function right()
	{
		let days_in_this_month = new Date(year, month + 1, 0).getDate();

		if (is_month_mode)
		{
			if (month == 11)
			{
				month = 0;
				year++;
			}
			else
				month++;

			this_monday -= days_in_this_month;
			while (this_monday < 0)
				this_monday += 7;
		}
		else
		{
			this_monday += 7;

			if (this_monday > days_in_this_month)
			{
				if (month == 11)
				{
					month = 0;
					year++;
				}
				else
					month++;

				this_monday -= days_in_this_month;
			}
		}
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

{#key unique}
	<Menu active="Accueil"/>
	<div id="container" class="flex flex-row gap-40">
		<div id="calendar_container" class="main gap-10">
			<div class="calendar">
				<div class="calendar_header">
					<input type="button" on:click={() => week_mode()} class="mode_button" id="week_mode_button" value="Semaines">
					<input type="button" on:click={() => month_mode()} class="mode_button_checked" id="month_mode_button" value="Mois">

					<button class="months_button" on:click={() => left()}>&lt;</button>
					<h1 id="titre">{month_names[month] + ' ' + year}</h1>
					<button class="months_button" on:click={() => right()}>&gt;</button>
					<span id="days_info">Nombre de jours de congé : 0 </span>
				</div>
				<Calendar {days} {absences} {is_month_mode}/>
			</div>			
		</div>
		<div class="gap-8 h-full">
			<div id="side_menu" class="gap-12 h-[35%]">
				<div class="legend">
					<div class="dots_column">
						<span id="green_dot" class="dot"></span>
						<span id="red_dot" class="dot"></span>
						<span id="blue_dot" class="dot"></span>
						<span id="gray_dot" class="dot"></span>
					</div>
					<span class="legend_text">Congé (congé payé, RTT...)<br>
					Maladie (accident, arrêt maladie...)<br>
					Absence physique (télétravail, formation...)<br>
					Demande en cours</span>
				</div>
				<button class="request_button" on:click={() => window.location.href="#/requests/new"}>Nouvelle demande</button>				
			</div>
			<RequestCard id={23} type={"Télétravail"} first_name={"Jean"} last_name={"Dupont"} state={"Brouillon"} days={["Jeudi", "Mardi"]} start={"01/12/2022"} end={"31/12/2022"} comments={"None"} purpose={"valider"}/>
		</div>		
	</div>
{/key}

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

	.request_button {
		position: relative;
		flex-direction: row;
		display: flex;

		font-size: 20px;
		color: white;
		background: #007AFF;
		border-radius: 14px;
		padding-top: 10px;
		padding-bottom: 10px;
		padding-left: 15px;
		padding-right: 15px;
	}

	.legend {
		position: relative;
		flex-direction: row;
		display: flex;
	}

	.dots_column {
		position: relative;
		flex-direction: column;
		display: flex;
		top: 4px;
	}

	.dot {
		position: relative;
		height: 25px;
		width: 25px;
		border-radius: 50%;
		display: inline-block;
		margin-top: 7px;
	}

	.legend_text {
		position: relative;
		padding-top: 15px;
		text-align: left;
		line-height: 32px;
		left: 15px;
	}

	#container {
		position: relative;
		flex-direction: row;
		display: flex;
		width: 100%;
	}

	#calendar_container {
		position: relative;
		flex-direction: column;
		display: flex;
		height: 100vh;
	}

	#side_menu {
		position: relative;
		flex-direction: column;
		display: flex;
	}

	#month_mode_button {
		left: 115px;
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

	#green_dot {
		background-color: #0AD442;
	}

	#red_dot {
		background-color: #F62942;
	}

	#blue_dot {
		background-color: #1640D4;
	}

	#gray_dot {
		background-color: #AEB4C3;
	}
</style>
