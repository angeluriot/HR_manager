<script lang="ts">
	import Calendar from "../components/Calendar.svelte";
	import RequestCard from "../components/RequestCard.svelte";
	import { onMount } from "svelte";
	import { onDestroy } from "svelte";
	import Global from "../shared/Global.js";
	import Menu from '../components/menu/Menu.svelte';
	import * as Server from "../shared/server.js";
	import type { RequestData } from "../shared/types";
	import { date_to_string, string_to_date } from "../shared/utils";

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

	onDestroy(() => Global.displayed = null);

	let days = [];
	let now = new Date();

	let year;
	let month;

	if (Global.displayed != null)
	{
		year = Number(Global.displayed.start.day.substring(6));
		month = Number(Global.displayed.start.day.substring(3, 5)) - 1;
	}

	else
	{
		year = now.getFullYear();
		month = now.getMonth();
	}

	let day = now.getDate();
	let day_of_the_week = now.getDay();
	let this_monday: number;

	//days of the current displayed period
	let days_in_db: {start: Date, end: Date};
	//requests corresponding to the displayed period
	let requests: RequestData[] = [];

	if (day - day_of_the_week > 0)
		this_monday = day - day_of_the_week;
	else
		this_monday = day - day_of_the_week + new Date(year, month, 0).getDate();

	let month_names = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

	let public_holidays = [new Date(2023, 3, 10), new Date(2023, 4, 1), new Date(2023, 4, 8), new Date(2023, 4, 18), new Date(2023, 4, 29), new Date(2023, 6, 14), new Date(2023, 7, 15), new Date(2023, 10, 1), new Date(2023, 11, 25)];

	let calendar_title: string;

	let is_month_mode = true;

	let state_filters = [
		{name: "Validées", checked: true},
		{name: "En cours", checked: true},
		{name: "Brouillon", checked: true}
	];
	let user_filters = [];
	let department_filters = [];

	let different_users: string[];
	let different_departments: string[];

	let raw_absences = [];

	/*
	let raw_absences = [
		{id: 0, title: "A. Didot (RTT)", first_name: "Anne", last_name: "Didot", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), end_date: new Date(2023, 0, 5), section_duration: 0, start_row: 0, start_col: 0, position: -1, type: "conge", sub_type: "RTT", shown: true, comment: "", state: "Brouillon", remote_days: [], selected: false},
		{id: 1, title: "C. Moray (AM)", first_name: "Charles", last_name: "Moray", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), end_date: new Date(2023, 0, 4), section_duration: 0, start_row: 0, start_col: 0, position: -1, type: "maladie", sub_type: "Arrêt maladie", shown: true, comment: "", state: "Brouillon", remote_days: [], selected: false},
		{id: 2, title: "D. Hopol (AM)", first_name: "Didier", last_name: "Hopol", date: new Date(2023, 0, 5), section_date: new Date(2023, 0, 5), end_date: new Date(2023, 0, 6), section_duration: 0, start_row: 0, start_col: 0, position: -1, type: "maladie", sub_type: "Arrêt maladie", shown: true, comment: "", state: "Brouillon", remote_days: [], selected: false},
		{id: 3, title: "A. Bertrand (T)", first_name: "Arnaud", last_name: "Bertrand", date: new Date(2023, 0, 4), section_date: new Date(2023, 0, 4), end_date: new Date(2023, 0, 5), section_duration: 0, start_row: 0, start_col: 0, position: -1, type: "physique", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", remote_days: [], selected: false},
		{id: 4, title: "E. Tessier (T)", first_name: "Emmanuelle", last_name: "Tessier", date: new Date(2023, 0, 30), section_date: new Date(2023, 0, 30), end_date: new Date(2023, 1, 2), section_duration: 0, start_row: 0, start_col: 0, position: -1, type: "physique", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", remote_days: [], selected: false},
		{id: 5, title: "F. Guilbault (T)", first_name: "Frédéric", last_name: "Guilbault", date: new Date(2023, 0, 11), section_date: new Date(2023, 0, 11), end_date: new Date(2023, 0, 19), section_duration: 0, start_row: 0, start_col: 0, position: -1, type: "physique", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", remote_days: [], selected: false},
		{id: 6, title: "G. Evian (T)", first_name: "Guillaume", last_name: "Evian", date: new Date(2023, 0, 3), section_date: new Date(2023, 0, 3), end_date: new Date(2023, 0, 5), section_duration: 0, start_row: 0, start_col: 0, position: -1, type: "en_cours", sub_type: "Télétravail", shown: true, comment: "", state: "Brouillon", remote_days: [], selected: false}
	];*/

	let absences_week = [];
	let absences_week_month = [];
	let absences = [];

	$: is_month_mode, this_monday, month, year, update_calendar();

	// Update calendar when month is changed
	async function update_calendar()
	{
		days = [];

		let first_day = new Date(year, month, 0).getDay();
		let days_in_this_month = new Date(year, month + 1, 0).getDate();
		let days_in_last_month = new Date(year, month, 0).getDate();
		let prev_month = month == 0 ? 11 : month - 1;

		let first_day_date: Date;
		let last_day_date: Date;

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

			calendar_title = date_to_string(first_day_date) + " - " + date_to_string(last_day_date);
		}

		days_in_db = {start: days[0].date, end: days[days.length-1].date};
		requests = await Server.get('calendar-requests', { start: days_in_db.start, end: days_in_db.end, department:"" });
		raw_absences = [];
		different_users = [];
		different_departments = [];

		let tmp = [];

		// Remove useless user filters
		for (let filter of user_filters)
		{
			let is_useful: boolean = false;

			for (let request of requests)
			{
				if (request.author.first_name + " " + request.author.last_name == filter.name &&
					!(is_month_mode && Number(string_to_date(request.start.day).getMonth()) != month && Number(string_to_date(request.end.day).getMonth()) != month))
					is_useful = true;
			}

			if (is_useful)
				tmp.push(filter);
		}

		user_filters = tmp;
		tmp = [];

		// Remove useless department filters
		for (let filter of department_filters)
		{
			let is_useful: boolean = false;

			for (let request of requests)
			{
				if (request.author.department == filter.name &&
					!(is_month_mode && Number(string_to_date(request.start.day).getMonth()) != month && Number(string_to_date(request.end.day).getMonth()) != month))
					is_useful = true;
			}

			if (is_useful)
				tmp.push(filter);
		}

		department_filters = tmp;

		for (let request of requests)
		{
			request_data_to_absence(request);
			let this_user: string = request.author.first_name + " " + request.author.last_name;

			if (!different_users.includes(this_user))
				different_users.push(this_user);

			if (Global.user && Global.user.department == "RH" && !different_departments.includes(request.author.department))
				different_departments.push(request.author.department);
		}

		// Add user filters
		if (different_users.length > 1)
			for (let user of different_users)
			{
				let is_already_a_filter: boolean = false;

				for (let filter of user_filters)
					if (filter.name == user)
						is_already_a_filter = true;

				if (!is_already_a_filter)
					user_filters.push({name: user, checked: true});
			}

		// Add department filters
		if (Global.user && Global.user.department == "RH" && different_departments.length > 1)
			for (let department of different_departments)
			{
				let is_already_a_filter: boolean = false;

				for (let filter of department_filters)
					if (filter.name == department)
						is_already_a_filter = true;

				if (!is_already_a_filter)
					department_filters.push({name: department, checked: true});
			}

		if (user_filters.length == 1)
			user_filters = [];

		if (department_filters.length == 1)
			department_filters = [];

		absences_week = [];
		absences_week_month = [];
		absences = [];

		// Split all absences into sub-absences to display the sections correctly
		for (let absence of raw_absences)
		{
			if (absence.sub_type == "Télétravail" && absence.remote_days.length > 0)
			{
				let today: Date = new Date(absence.section_date.getTime());

				while (today <= absence.end_date)
				{
					let is_holiday: boolean = false;

					for (let holiday of public_holidays)
						if (today.getTime() == holiday.getTime())
							is_holiday = true;

					if (!is_holiday && today.getDay() != 6 && today.getDay() != 0)
						for (let remote_day of absence.remote_days)
							if (today.getDay() == remote_day.day &&
								!(today.getTime() == absence.date.getTime() && absence.start_pm && !remote_day.pm) &&
								!(today.getTime() == absence.end_date.getTime() && !absence.end_pm && !remote_day.am))
								absences_week.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: new Date(today.getTime()), end_date: new Date(today.getTime()), section_duration: 1, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, remote_days: absence.remote_days, selected: absence.selected, start_pm: absence.start_pm, end_pm: absence.end_pm, department: absence.department});

					today.setDate(today.getDate() + 1);
				}
			}

			else
			{
				if (absence.section_date.getDay() == 0)
					absence.section_date.setDate(absence.section_date.getDate() + 1);

				else if (absence.section_date.getDay() == 6)
					absence.section_date.setDate(absence.section_date.getDate() + 2);

				let this_section_date = absence.section_date;
				let this_friday = new Date(this_section_date.getFullYear(), this_section_date.getMonth(), this_section_date.getDate() + (5 - this_section_date.getDay()));

				// Split into sub-absences if the sub-absence is longer than a week or if there is a holiday
				while (this_friday < absence.end_date)
				{
					let holiday_this_week: Date;
					let holiday_today: boolean = false;

					for (let holiday of public_holidays)
					{
						if (holiday <= this_friday && holiday > this_section_date)
							holiday_this_week = holiday;

						else if (holiday.getTime == this_section_date.getTime())
							holiday_today = true;
					}

					if (holiday_today)
					{
						if (this_section_date.getDay() != 5)
							this_section_date.setDate(this_section_date.getDate() + 1);
						else
							this_section_date.setDate(this_section_date.getDate() + 3);
					}

					else if (holiday_this_week != null)
					{
						let new_end_date: Date = new Date(holiday_this_week.getFullYear(), holiday_this_week.getMonth(), holiday_this_week.getDate() - 1);
						absences_week.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: new_end_date, section_duration: Math.abs(new_end_date.getTime() - this_section_date.getTime()) / (1000 * 3600 * 24) + 1, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, remote_days: absence.remote_days, selected: absence.selected, start_pm: absence.start_pm, end_pm: absence.end_pm, department: absence.department});

						if (holiday_this_week.getDay() != 5)
							this_section_date = new Date(holiday_this_week.getFullYear(), holiday_this_week.getMonth(), holiday_this_week.getDate() + 1);
						else
							this_section_date = new Date(holiday_this_week.getFullYear(), holiday_this_week.getMonth(), holiday_this_week.getDate() + 3);
					}

					else
					{
						absences_week.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: absence.end_date, section_duration: Math.abs(this_friday.getTime() - this_section_date.getTime()) / (1000 * 3600 * 24) + 1, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, remote_days: absence.remote_days, selected: absence.selected, start_pm: absence.start_pm, end_pm: absence.end_pm, department: absence.department});
						this_section_date = new Date(this_friday.getFullYear(), this_friday.getMonth(), this_friday.getDate() + 3);
						this_friday = new Date(this_section_date.getFullYear(), this_section_date.getMonth(), this_section_date.getDate() + (5 - this_section_date.getDay()));
					}
				}

				let holiday_this_week: Date;
				let holiday_today: boolean = false;

				for (let holiday of public_holidays)
				{
					if (holiday <= this_friday && holiday > this_section_date)
						holiday_this_week = holiday;

					else if (holiday.getTime() == this_section_date.getTime())
						holiday_today = true;
				}

				if (holiday_today)
				{
					if (this_section_date.getDay() != 5)
						this_section_date = new Date(this_section_date.getFullYear(), this_section_date.getMonth(), this_section_date.getDate() + 1);
					else
						this_section_date = new Date(this_section_date.getFullYear(), this_section_date.getMonth(), this_section_date.getDate() + 3);
				}

				else if (holiday_this_week != null)
				{
					let new_end_date: Date = new Date(holiday_this_week.getFullYear(), holiday_this_week.getMonth(), holiday_this_week.getDate() - 1);
					absences_week.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: new_end_date, section_duration: Math.abs(new_end_date.getTime() - this_section_date.getTime()) / (1000 * 3600 * 24) + 1, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, remote_days: absence.remote_days, selected: absence.selected, start_pm: absence.start_pm, end_pm: absence.end_pm, department: absence.department});
					if (holiday_this_week.getDay() != 5)
						this_section_date = new Date(holiday_this_week.getFullYear(), holiday_this_week.getMonth(), holiday_this_week.getDate() + 1);
					else
						this_section_date = new Date(holiday_this_week.getFullYear(), holiday_this_week.getMonth(), holiday_this_week.getDate() + 3);
				}

				absences_week.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: this_section_date, end_date: absence.end_date, section_duration: Math.abs(absence.end_date.getTime() - this_section_date.getTime()) / (1000 * 3600 * 24) + 1, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, remote_days: absence.remote_days, selected: absence.selected, start_pm: absence.start_pm, end_pm: absence.end_pm, department: absence.department});
			}
		}

		// Split into sub-absences if the sub-absence is longer than a month
		for (let absence of absences_week)
		{
			if (absence.section_duration + absence.section_date.getDate() > new Date(absence.section_date.getFullYear(), absence.section_date.getMonth() + 1, 0).getDate() + 1)
			{
				let current_duration = new Date(absence.section_date.getFullYear(), absence.section_date.getMonth() + 1, 0).getDate() - absence.section_date.getDate() + 1;
				absences_week_month.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: absence.section_date, end_date: absence.end_date, section_duration: current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, remote_days: absence.remote_days, selected: absence.selected, start_pm: absence.start_pm, end_pm: absence.end_pm, department: absence.department});
				absences_week_month.push({id: absence.id, title: absence.title, first_name: absence.first_name, last_name: absence.last_name, date: absence.date, section_date: new Date(absence.section_date.getFullYear(), absence.section_date.getMonth(), absence.section_date.getDate() + current_duration), end_date: absence.end_date, section_duration: absence.section_duration - current_duration, start_row: 0, start_col: 0, position: -1, type: absence.type, sub_type: absence.sub_type, shown: true, comment: absence.comment, state: absence.state, remote_days: absence.remote_days, selected: absence.selected, start_pm: absence.start_pm, end_pm: absence.end_pm, department: absence.department});
			}

			else
				absences_week_month.push(absence);
		}

		// Compute the correct rows and columns of the calendar to display each section
		for (let absence of absences_week_month)
		{
			if (!is_filtered(absence))
			{
				if (is_month_mode && absence.section_date.getFullYear() == year && absence.section_date.getMonth() == month)
				{
					absence.start_row = Math.floor((absence.section_date.getDate() + first_day - 1) / 7) + 2;
					absence.start_col = absence.section_date.getDay();

					absences.push(absence);
				}

				else if (!is_month_mode && absence.section_date >= first_day_date && absence.section_date <= last_day_date)
				{
					absence.start_row = 2;
					absence.start_col = absence.section_date.getDay();

					absences.push(absence);
				}
			}
		}

		for (let a of absences)
		{
			let i = 0;
			let position_found = false;
			a.shown = true;

			if (Global.displayed != null)
			{
				if (a.id == Global.displayed.id)
					a.selected = true;

				else if (a.selected)
					a.selected = false;
			}

			// Get a position for each section to avoid overlay
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
						if (a.id != b.id && b.position == i && are_overlayed(a.section_date.getDate(), a.section_duration, b.section_date.getDate(), b.section_duration))
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

		restart();
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
	}

	function month_mode()
	{
		if (is_month_mode)
			return;

		is_month_mode = true;
	}

	function is_filtered(absence)
	{
		if (absence.state == "Validée" && !state_filters[0].checked)
			return true;

		if (absence.state == "En attente" && !state_filters[2].checked)
			return true;

		if (absence.state == "Brouillon" && !state_filters[3].checked)
			return true;

		for (let user_filter of user_filters)
			if ((absence.first_name + " " + absence.last_name) == user_filter.name && !user_filter.checked)
				return true;

		for (let department_filter of department_filters)
			if (absence.department == department_filter.name && !department_filter.checked)
				return true;

		return false;
	}

	export const update_card = absence =>
	{
		for (let request of requests)
			if (request.id == absence.id)
				Global.displayed = request;

		update_calendar();
	}

	function request_data_to_absence(request_data)
	{
		let title: string = request_data.author.first_name.substring(0, 1) + ". " + request_data.author.last_name + " ";

		switch (request_data.type)
		{
			case "Télétravail":
				break;
			case "Congé payé":
				title += "(CP)";
				break;
			case "Congé exceptionnel":
				title += "(CE)";
				break;
			case "Congé sans solde":
				title += "(CSS)";
				break;
			case "RTT":
				title += "(RTT)";
				break;
			case "Formation":
				title += "(F)";
				break;
			case "Visite extérieure":
				title += "(VE)";
				break;
			case "Arrêt maladie":
				title += "(AM)";
				break;
			case "Arrêt de travail":
				title += "(ArT)"
				break;
			case "Accident du travail":
				title += "(AcT)"
				break;
		}

		let start_date: Date = new Date(Number(request_data.start.day.substring(6)), Number(request_data.start.day.substring(3, 5)) - 1, Number(request_data.start.day.substring(0, 2)));
		let end_date: Date = new Date(Number(request_data.end.day.substring(6)), Number(request_data.end.day.substring(3, 5)) - 1, Number(request_data.end.day.substring(0, 2)));
		let remote_days: {day: number, am: boolean, pm: boolean}[] = [];

		for (let r of request_data.remote)
			switch (r.day)
			{
				case "Lundi":
					remote_days.push({day: 1, am: r.am, pm: r.pm});
					break;
				case "Mardi":
					remote_days.push({day: 2, am: r.am, pm: r.pm});
					break;
				case "Mercredi":
					remote_days.push({day: 3, am: r.am, pm: r.pm});
					break;
				case "Jeudi":
					remote_days.push({day: 4, am: r.am, pm: r.pm});
					break;
				case "Vendredi":
					remote_days.push({day: 5, am: r.am, pm: r.pm});
					break;
			}

		let type: string;
		if (request_data.state == "En attente")
			type = "en_cours";

		else if (request_data.type == "Congé payé" || request_data.type == "Congé exceptionnel" || request_data.type == "Congé sans solde" || request_data.type == "RTT")
			type = "conge";

		else if (request_data.type == "Arrêt maladie" || request_data.type == "Arrêt de travail" || request_data.type == "Accident du travail")
			type = "maladie";

		else
			type = "physique";

		raw_absences = [...raw_absences, ({
			id: request_data.id,
			title: title,
			first_name: request_data.author.first_name,
			last_name: request_data.author.last_name,
			date: start_date,
			section_date: start_date,
			end_date: end_date,
			section_duration: 0,
			start_row: 0,
			start_col: 0,
			position: -1,
			type: type,
			sub_type: request_data.type,
			shown: true,
			comment: request_data.comment,
			state: request_data.state,
			remote_days: remote_days,
			selected: false,
			start_pm: request_data.start.pm,
			end_pm: request_data.end.pm,
			department: request_data.author.department
		})];
	}

	(async () => {
		await (new Promise( resolve => setTimeout(resolve, 100) ));
		update_calendar();
	})();

</script>

{#key unique}
	<Menu active="Accueil"/>
{/key}
<div class="main flex flex-row gap-20 justify-center items-start w-full h-full pt-[70px]">
	{#key unique}
		<div class="gap-10 flex flex-col justify-center items-center">
			<div class="calendar_header flex flex-row justify-between items-center w-full">
				<div class="flex flex-row justify-center items-center gap-3">
					<input type="button" on:click={() => week_mode()} class="mode_button rounded-full {is_month_mode ? "" : "selected"}" id="week_mode_button" value="Semaines">
					<input type="button" on:click={() => month_mode()} class="mode_button rounded-full {is_month_mode ? "selected" : ""}" id="month_mode_button" value="Mois">
				</div>
				<div class="flex flex-row justify-center items-center {is_month_mode ? "gap-5" : "gap-2"}">
					<button class="months_button" on:click={() => left()}>&lt;</button>
					<h1>{calendar_title}</h1>
					<button class="months_button" on:click={() => right()}>&gt;</button>
				</div>
				<div class="days_info flex flex-row justify-center items-center gap-2">
					<h2>Jours de congé :</h2>
					<span>{Global.days_left}</span>
				</div>
			</div>
			<Calendar {update_card} {public_holidays} {days} {absences} {is_month_mode}/>
		</div>
	{/key}
	<div class="gap-10 flex flex-col justify-center items-start w-[450px] mt-2">
		<a href="#/requests/new" class="new-request"><button class="bg-[#007AFF] cursor-pointer rounded-xl text-white">
			Nouvelle demande
		</button></a>
		<div class="filters relative">
			<div class="overflow-auto w-full h-full flex flex-col justify-start items-start px-5 gap-2">
				<div class="mt-4"></div>
				{#each state_filters as filter}
					<div class="flex flex-row gap-2">
						<input type="checkbox" bind:checked={filter.checked} on:change={update_calendar}/>
						<span>{filter.name}</span>
					</div>
				{/each}
				{#each department_filters as filter}
					<div class="flex flex-row gap-2">
						<input type="checkbox" bind:checked={filter.checked} on:change={update_calendar}/>
						<span>{filter.name}</span>
					</div>
				{/each}
				{#each user_filters as filter}
					<div class="flex flex-row gap-2">
						<input type="checkbox" bind:checked={filter.checked} on:change={update_calendar}/>
						<span>{filter.name}</span>
					</div>
				{/each}
				<div class="mb-4"></div>
			</div>
			<h2 class="absolute">Filtres</h2>
		</div>
		{#key unique}
			{#if Global.displayed != null}
				<div class="max-w-[450px] w-full">
					<RequestCard data={Global.displayed} user={false} place="home" on:validation={update_calendar}/>
				</div>
			{/if}
			<div class="legende flex flex-col justify-center items-start gap-3">
				<div class="flex flex-row gap-3 items-center">
					<span class="dot bg-[#0AD442]"></span>
					<span>Congé (congé payé, RTT...)</span>
				</div>
				<div class="flex flex-row gap-3 items-center">
					<span class="dot bg-[#F62942]"></span>
					<span>Maladie (accident, arrêt maladie...)<br>
				</div>
				<div class="flex flex-row gap-3 items-center">
					<span class="dot bg-[#1640D4]"></span>
					<span>Absence physique (télétravail, formation...)<br>
				</div>
				<div class="flex flex-row gap-3 items-center">
					<span class="dot bg-[#AEB4C3]"></span>
					<span>Demande en attente<br>
				</div>
			</div>
		{/key}
	</div>
</div>

<style>
	.main
	{
		overflow-y: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.main::-webkit-scrollbar
	{
		display: none;
	}

	.calendar_header
	{
		text-align: center;
	}

	.months_button
	{
		border: 1px;
		cursor: pointer;
	}

	.calendar_header h1, .calendar_header button
	{
		font-family: "Nunito-Bold";
		font-size: 25px;
		color: #09244B;
	}

	.calendar_header button
	{
		padding: 5px 15px 5px 15px;
		margin: -5px -15px -5px -15px;
	}

	.days_info h2
	{
		font-family: "Nunito-Bold";
		font-size: 19px;
		color: #09244B;
	}

	.days_info span
	{
		font-family: "Roboto-Regular";
		font-size: 19px;
	}

	.mode_button
	{
		padding: 19px 30px 18px 30px;
		line-height: 0px;
		font-family: "Nunito-SemiBold";
		font-size: 17px;
		color: #526581;
		user-select: none;
		cursor: pointer;
	}

	.mode_button:hover
	{
		background-color: #e0efff;
	}

	.mode_button.selected
	{
		background-color: #007AFF;
		color: white;
		pointer-events: none;
	}

	.new-request button
	{
		@apply select-none;
		width: 240px;
		height: 50px;
		font-family: "Nunito-Bold";
		font-size: 18px;
		line-height: 0px;
	}

	.new-request button:hover
	{
		background-color: #005CC0;
	}

	.dot
	{
		height: 25px;
		width: 25px;
		border-radius: 50%;
	}

	.legende span
	{
		font-family: "Nunito-SemiBold";
		color: #526581;
		font-size: 17px;
		line-height: 0px;
	}

	.filters
	{
		width: 350px;
		height: 165px;
		border: 2px solid #b6b9c4;
		border-radius: 15px;
		user-select: none;
	}

	.filters *
	{
		user-select: none;
	}

	.filters h2
	{
		pointer-events: none;
		position: absolute;
		top: -9px;
		left: 15px;
		font-family: "Nunito-SemiBold";
		color: #6D6E7A;
		font-size: 16px;
		line-height: 16px;
		background-color: white;
		padding: 0px 4px 0px 4px;
		border-radius: 999px;
	}

	.filters div
	{
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.filters div::-webkit-scrollbar
	{
		display: none;
	}

	.filters span
	{
		font-family: "Nunito-SemiBold";
		color: #526581;
		font-size: 17px;
		line-height: 0px;
		margin-top: 1px;
	}

	input[type="checkbox"]
	{
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;

		width: 26px;
		height: 26px;
		cursor: pointer;
		border: 2px solid #B1B3C5;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	input[type="checkbox"]:checked::after
	{
		content: "";
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #007AFF;
	}
</style>
