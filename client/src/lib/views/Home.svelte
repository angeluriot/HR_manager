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

	let public_holidays = [[3, 10], [4, 1], [4, 8], [4, 18], [4, 29], [6, 14], [7, 15], [10, 1], [11, 25]];

	let calendar_title: string;

	let is_month_mode = true;

	let card_type: string = "";
	let card_first_name: string = "";
	let card_last_name: string = "";
	let card_state: string = "";
	let card_days: string[] = [];
	let card_start: string = "";
	let card_end: string = "";
	let card_comment: string = "";
	let card_action: string = "";

	let raw_absences = [
		{id: 0, title: "A. Didot (RTT)", first_name: "Anne", last_name: "Didot", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), end_date: new Date(2023, 0, 5), duration: 3, section_duration: 3, start_row: 0, start_col: 0, position: -1, type: "conge", sub_type: "RTT", shown: true, comment: "", state: "Brouillon", days: [], selected: false},
		{id: 1, title: "C. Moray (AM)", first_name: "Charles", last_name: "Moray", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), end_date: new Date(2023, 0, 4), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "maladie", sub_type: "Arrêt maladie", shown: true, comment: "", state: "Brouillon", days: [], selected: false},
		{id: 2, title: "D. Hopol (AM)", first_name: "Didier", last_name: "Hopol", date: new Date(2023, 0, 5), section_date: new Date(2023, 0, 5), end_date: new Date(2023, 0, 6), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "maladie", sub_type: "Arrêt maladie", shown: true, comment: "", state: "Brouillon", days: [], selected: false},
		{id: 3, title: "A. Bertrand (T)", first_name: "Arnaud", last_name: "Bertrand", date: new Date(2023, 0, 4), section_date: new Date(2023, 0, 4), end_date: new Date(2023, 0, 5), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "physique", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", days: [], selected: false},
		{id: 4, title: "E. Tessier (T)", first_name: "Emmanuelle", last_name: "Tessier", date: new Date(2023, 0, 30), section_date: new Date(2023, 0, 30), end_date: new Date(2023, 0, 31), duration: 2, section_duration: 2, start_row: 0, start_col: 0, position: -1, type: "physique", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", days: [], selected: false},
		{id: 5, title: "F. Guilbault (T)", first_name: "Frédéric", last_name: "Guilbault", date: new Date(2023, 0, 11), section_date: new Date(2023, 0, 11), end_date: new Date(2023, 0, 19), duration: 7, section_duration: 7, start_row: 0, start_col: 0, position: -1, type: "physique", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", days: [], selected: false},
		{id: 6, title: "G. Evian (T)", first_name: "Guillaume", last_name: "Evian", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), end_date: new Date(2023, 0, 5), duration: 3, section_duration: 3, start_row: 0, start_col: 0, position: -1, type: "en_cours", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", days: [], selected: false}
	];

	let absences_holidays = [];
	let absences_week = [];
	let absences_week_month = [];
	let absences = [];

	$: is_month_mode, this_monday, month, year, update_calendar();

	init_calendar();

	// Initialize all the calendar sections
	function init_calendar()
	{
		for (let absence of raw_absences)
		{
			let this_holidays = [];

			if (absence.section_date.getDay() == 0)
				absence.section_date = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + 1);

			else if (absence.section_date.getDay() == 6)
				absence.section_date = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + 2);

			if (absence.section_date.getFullYear() == 2023 &&
				((absence.section_date.getMonth() == 3 && absence.section_date.getDate() == 10) ||
				 (absence.section_date.getMonth() == 4 && absence.section_date.getDate() == 1) ||
				 (absence.section_date.getMonth() == 4 && absence.section_date.getDate() == 8) ||
				 (absence.section_date.getMonth() == 5 && absence.section_date.getDate() == 29) ||
				 (absence.section_date.getMonth() == 11 && absence.section_date.getDate() == 25)))
				absence.section_date = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + 1);

			//let weekend_days = get_weekend_days(absence.section_date, absence.section_duration, true, absence.title == "test");

			//let end_date = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + absence.section_duration + weekend_days);
			let this_section_date = absence.section_date;
			let this_section_duration;

			for (let holiday of public_holidays)
				if ((holiday[0] > absence.section_date.getMonth() || (holiday[0] == absence.section_date.getMonth() && holiday[1] >= absence.section_date.getDate())) &&
					(absence.end_date.getFullYear() > 2023 || holiday[0] < absence.end_date.getMonth() || (holiday[0] == absence.end_date.getMonth() && holiday[1] <= absence.end_date.getDate())) &&
					absence.section_date.getFullYear() <= 2023 && absence.end_date.getFullYear() >= 2023)
					this_holidays.push(holiday);

			let first_section: boolean = true;

			if (this_holidays.length > 0)
			{
				let holiday_surplus: number = Math.floor(this_holidays.length / 7) * 2;
				let h: number = absence.end_date.getDay() + this_holidays.length + holiday_surplus;

				//if (h > 5)
					//holiday_surplus += 2;

				//end_date = new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate() + this_holidays.length + holiday_surplus);

				for (let holiday of this_holidays)
				{
					this_section_duration = Math.round(((new Date(2023, holiday[0], holiday[1])).getTime() - this_section_date.getTime()) / (1000 * 60 * 60 * 24));
					this_section_duration -= get_weekend_days(this_section_date, this_section_duration, false);

					if (first_section && absence.date.getDay() == 0)
						this_section_duration--;

					if (this_section_duration > 0)
						absences_holidays.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: absence.end_date, duration: absence.duration, section_duration: this_section_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, days: absence.days, selected: absence.selected});

					this_section_date = new Date(2023, holiday[0], holiday[1] + 1);
					first_section = false;
				}

				this_section_duration = Math.round((absence.end_date.getTime() - this_section_date.getTime()) / (1000 * 60 * 60 * 24)) + 1 - (absence.section_date.getDay() == 0 ? 1 : 0);

				this_section_duration -= get_weekend_days(this_section_date, this_section_duration, false);

				absences_holidays.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: absence.end_date, duration: absence.duration, section_duration: this_section_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, days: absence.days, selected: absence.selected});
			}

			else
				absences_holidays.push(absence);
		}

		// Split all absences into sub-absences to display the sections correctly
		for (let absence of absences_holidays)
		{
			let current_duration = absence.section_duration;
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

					absences_week.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: absence.end_date, duration: absence.duration, section_duration: this_section_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, days: absence.days, selected: absence.selected});
					this_section_date = new Date(this_section_date.getFullYear(), this_section_date.getMonth(), this_section_date.getDate() + 8 - this_section_date.getDay());
				}

				absences_week.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: absence.end_date, duration: absence.duration, section_duration: current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, days: absence.days, selected: absence.selected});
			}

			else
			{
				absences_week.push(absence);
			}
		}

		// Split into sub-absences if the sub-absence is longer than a month
		for (let absence of absences_week)
		{
			if (absence.section_duration + absence.section_date.getDate() > new Date(absence.section_date.getFullYear(), absence.section_date.getMonth() + 1, 0).getDate() + 1)
			{
				let current_duration = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth() + 1, 0).getDate() - absence.section_date.getDate() + 1;
				absences_week_month.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: absence.section_date, end_date: absence.end_date, duration: absence.duration, section_duration: current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, days: absence.days, selected: absence.selected});
				absences_week_month.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + current_duration), end_date: absence.end_date, duration: absence.duration, section_duration: absence.section_duration - current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, days: absence.days, selected: absence.selected});
			}

			else
				absences_week_month.push(absence);
		}
	}

	// Update calendar when month is changed
	function update_calendar()
	{
		console.log("test");
		days = [];
		absences = [];

		let first_day = new Date(year, month, 0).getDay();
		let days_in_this_month = new Date(year, month + 1, 0).getDate();
		let days_in_last_month = new Date(year, month, 0).getDate();
		let prev_month = month == 0 ? 11 : month - 1;

		if (is_month_mode)
		{
			calendar_title = month_names[month] + ' ' + year;

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
			let first_day_date: Date;
			let last_day_date: Date;

			for (let i = 1; i < 8; i++)
			{
				if (this_monday + i <= days_in_this_month)
				{
					if (i == 1)
						first_day_date = new Date(year, month, this_monday + i);
					else if (i == 7)
						last_day_date = new Date(year, month, this_monday + i);

					days.push({name: ' ' + (this_monday + i), this_month: true, date: new Date(year, month, this_monday + i)});
				}

				else
				{
					if (i == 1)
						first_day_date = new Date(year, month + 1, this_monday + i - days_in_this_month);
					else if (i == 7)
						last_day_date = new Date(year, month + 1, this_monday + i - days_in_this_month);

					days.push({name: ' ' + (this_monday + i - days_in_this_month), this_month: true, date: new Date(year, month + 1, this_monday + i - days_in_this_month)});
				}
			}

			calendar_title = (first_day_date.getDate() < 10 ? "0" : "") + first_day_date.getDate() + "/" +
							(first_day_date.getMonth() + 1 < 10 ? "0" : "") + (first_day_date.getMonth() + 1) + "/" +
							first_day_date.getFullYear() + " - " +
							(last_day_date.getDate() < 10 ? "0" : "") + last_day_date.getDate() + "/" +
							(last_day_date.getMonth() + 1 < 10 ? "0" : "") + (last_day_date.getMonth() + 1) + "/" +
							last_day_date.getFullYear();
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

	function get_weekend_days(date: Date, duration: number, b: boolean, b2: boolean = false)
	{
		if (b)
		{
			let final_res: number = 0;
			let res: number;
			let rest: number;
			let this_day: number = date.getDay();

			if (this_day == 0)
				this_day = 1;

			while (duration > 0)
			{
				res = Math.floor(duration / 7);
				rest = duration % 7;

				if (this_day + rest > 5)
				{
					res++;
					this_day = 1;
				}

				duration = res * 2;
				final_res += res;
			}

			return final_res * 2;
		}

		else
		{
			let res = Math.floor(duration / 7);
			let rest = duration % 7;
			if (date.getDay() + rest > 5)
				res ++;

			return res * 2;
		}
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

	export const update_card = absence =>
	{
		for (let abs of absences)
		{
			if (abs.id == absence.id)
				abs.selected = true;

			else if (abs.selected)
				abs.selected = false;
		}

		card_type = absence.sub_type;
		card_first_name = absence.first_name;
		card_last_name = absence.last_name;
		card_state = absence.state;

		card_days = [];
		for (let day of absence.days)
		{
			switch(day)
			{
				case 1:
				{
					card_days.push("Lundi");
					break;
				}
				case 2:
				{
					card_days.push("Mardi");
					break;
				}
				case 3:
				{
					card_days.push("Mercredi");
					break;
				}
				case 4:
				{
					card_days.push("Jeudi");
					break;
				}
				case 5:
				{
					card_days.push("Vendredi");
					break;
				}
			}
		}

		card_start = (absence.date.getDate() < 10 ? "0" : "") + absence.date.getDate() + "/" + (absence.date.getMonth() + 1 < 10 ? "0" : "") + (absence.date.getMonth() + 1) + "/" + absence.date.getFullYear();
		card_end = (absence.end_date.getDate() < 10 ? "0" : "") + absence.end_date.getDate() + "/" + (absence.end_date.getMonth() + 1 < 10 ? "0" : "") + (absence.end_date.getMonth() + 1) + "/" + absence.end_date.getFullYear();
		card_comment = absence.comment;

		if (absence.type == "En attente")
			card_action = "Valider";

		else
			card_action = "Valider"; // temporaire

		update_calendar();
	}

	update_card(raw_absences[0]);
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
					<h1 id="titre">{calendar_title}</h1>
					<button class="months_button" on:click={() => right()}>&gt;</button>
					<span id="days_info">Jours de congé : 0 </span>
				</div>
				<Calendar {update_card} {public_holidays} {days} {absences} {is_month_mode}/>
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
			<RequestCard id={23} type={card_type} first_name={card_first_name} last_name={card_last_name} state={card_state} days={card_days} start={card_start} end={card_end} comment={card_comment} action={card_action}/>
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
