import mongoose from 'mongoose';
import { config } from 'dotenv';
import * as User from './models/user.js';
import * as Request from './models/request.js';

export async function connect_mongodb()
{
	config();

	if (!process.env.MONGODB_URL)
		throw new Error('MONGODB_URL environment variable not set');

	try
	{
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.MONGODB_URL);
	}

	catch (error: any)
	{
		throw new Error('MongoDB connection error (' + error.message + ')');
	}

	console.log('Connected to MongoDB');
}

export function date_to_string(date: Date)
{
	let day = date.getDate().toString();
	let month = (date.getMonth() + 1).toString();
	let year = date.getFullYear().toString();

	if (day.length == 1)
		day = "0" + day;

	if (month.length == 1)
		month = "0" + month;

	return day + "/" + month + "/" + year;
}

export function string_to_date(date: string)
{
	let day = parseInt(date.substring(0, 2));
	let month = parseInt(date.substring(3, 5));
	let year = parseInt(date.substring(6, 10));

	return new Date(year, month - 1, day);
}

export async function get_days_left(email: string)
{
	let today = new Date();
	let last_may_first = new Date(today.getFullYear(), 4, 1);

	if (today.getTime() < last_may_first.getTime())
		last_may_first.setFullYear(last_may_first.getFullYear() - 1);

	let nb_days = 2.5 * (today.getMonth() - last_may_first.getMonth() + (12 * (today.getFullYear() - last_may_first.getFullYear())));
	let requests = await Request.getAll({ author: email });

	if (!requests || requests.length == 0)
		return nb_days;

	let days = 0;

	for (let request of requests)
	{
		if (!((request.type == "Congé payé" || request.type == "Congé exceptionnel") && request.state == "Validée"))
			continue;

		let start = string_to_date(request.start.day);
		let end = string_to_date(request.end.day);

		for (let i = start.getTime(); i <= end.getTime(); i += 86400000)
		{
			let day = new Date(i).getDay();

			if (day == 0 || day == 6)
				continue;

			days++;
		}

		days -= 0.5;

		if (request.end.pm)
			days += 0.5;

		if (request.start.pm)
			days -= 0.5;
	}

	return nb_days - days;
}
