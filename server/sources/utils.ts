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
