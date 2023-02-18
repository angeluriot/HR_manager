import mongoose from 'mongoose';

export interface UserInterface extends mongoose.Document
{
	email: string;
	hashed_password: string;
	first_name: string;
	last_name: string;
	department: string;
	manager: string;
}

const user_schema = new mongoose.Schema(
{
	email: {
		type: String,
		index: true,
		unique: true,
		required: true
	},
	hashed_password: {
		type: String,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	department: {
		type: String,
		required: true
	},
	manager: {
		type: String,
		required: true
	}
}, { timestamps: true });

export const User = mongoose.model('users', user_schema);

export async function get(filter: any): Promise<UserInterface | null>
{
	return await User.findOne(filter);
}

export async function getAll(filter: any): Promise<UserInterface[] | null>
{
	return await User.find(filter);
}

export async function remove(filter: any)
{
	await User.findOneAndRemove(filter);
}

export type UserData = {
	email: string,
	hashed_password: string,
	first_name: string,
	last_name: string,
	department: string,
	manager: string
};

export async function get_data(user: UserInterface): Promise<UserData>
{
	return {
		email: user.email,
		hashed_password: user.hashed_password,
		first_name: user.first_name,
		last_name: user.last_name,
		department: user.department,
		manager: user.manager
	};
}

export async function add(data: UserData): Promise<UserInterface>
{
	if (await get({ email: data.email }))
		throw new Error(`User (email: ${data.email}) already exists`);

	const user = new User({
		email: data.email,
		hashed_password: data.hashed_password,
		first_name: data.first_name,
		last_name: data.last_name,
		department: data.department,
		manager: data.manager
	});

	//@ts-ignore
	return await user.save();
}
