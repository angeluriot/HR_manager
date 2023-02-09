import mongoose from 'mongoose';

export interface DepartmentInterface extends mongoose.Document
{
	name: string;
}

const department_schema = new mongoose.Schema(
{
	name: {
		type: String,
		index: true,
		unique: true,
		required: true
	}
}, { timestamps: true });

export const Department = mongoose.model('departments', department_schema);

export async function get(filter: any): Promise<DepartmentInterface | null>
{
	return await Department.findOne(filter);
}

export async function remove(filter: any)
{
	await Department.findOneAndRemove(filter);
}

export type DepartmentData = {
	name: string
};

export async function get_data(department: DepartmentInterface): Promise<DepartmentData>
{
	return {
		name: department.name
	};
}

export async function add(data: DepartmentData): Promise<DepartmentInterface>
{
	const department = new Department({
		name: data.name
	});

	//@ts-ignore
	return await department.save();
}
