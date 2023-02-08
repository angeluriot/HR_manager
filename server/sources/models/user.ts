import mongoose from 'mongoose';
import * as Department from './department.js';

export interface UserInterface extends mongoose.Document
{
	email: string;
	hashed_password: string;
	first_name: string;
	last_name: string;
	department: mongoose.Types.ObjectId;
	employees: mongoose.Types.ObjectId[];
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
		type: mongoose.Types.ObjectId,
		ref: 'departments',
		required: true
	},
	employees: [{
		type: mongoose.Types.ObjectId,
		ref: 'users',
		default: []
	}]
}, { timestamps: true });

export const User = mongoose.model('users', user_schema);

export async function get(filter: any): Promise<UserInterface | null>
{
	return await User.findOne(filter);
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
	department: Department.DepartmentData,
	employees: UserData[]
};

export async function get_data(user: UserInterface): Promise<UserData>
{
	let department = await Department.get({ _id: user.department });

	if (!department)
		throw new Error(`Department (id: ${user.department.toString()}) not found`);

	let department_data = await Department.get_data(department);
	let employees_data: UserData[] = [];

	for (let i = 0; i < user.employees.length; i++)
	{
		let employee = await get({ _id: user.employees[i] });

		if (!employee)
			throw new Error(`Employee (id: ${user.employees[i].toString()}) not found`);

		employees_data.push(await get_data(employee));
	}

	return {
		email: user.email,
		hashed_password: user.hashed_password,
		first_name: user.first_name,
		last_name: user.last_name,
		department: department_data,
		employees: employees_data
	};
}

export async function add(data: UserData): Promise<UserInterface>
{
	let department = await Department.get({ name: data.department.name });

	if (!department)
		throw new Error(`Department (name: ${data.department.name}) not found`);

	let department_id = department._id;
	let employees_id: any[] = [];

	for (let i = 0; i < data.employees.length; i++)
	{
		let employee = await get({ email: data.employees[i].email });

		if (!employee)
			throw new Error(`Employee (email: ${data.employees[i].email}) not found`);

		employees_id.push(employee._id);
	}

	if (await get({ email: data.email }))
		throw new Error(`User (email: ${data.email}) already exists`);

	const user = new User({
		email: data.email,
		hashed_password: data.hashed_password,
		first_name: data.first_name,
		last_name: data.last_name,
		department: department_id,
		employees: employees_id
	});

	//@ts-ignore
	return await user.save();
}
