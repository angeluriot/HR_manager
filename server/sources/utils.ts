import mongoose from 'mongoose';
import { config } from 'dotenv';

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
