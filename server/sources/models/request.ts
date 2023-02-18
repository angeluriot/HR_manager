import mongoose from 'mongoose';
import * as User from './user.js';

export interface RequestInterface extends mongoose.Document
{
	type: string;
	concerned: string;
	state: number;
	days_remote: Array<String>;
	period_days_remote: Array<Number>; // 1 for morning, 2 for afternoon, 3 for both
	start: String; 
	start_isam: boolean;
	end: String;
	end_isam: boolean;
	subject_ext: string;
	place_ext: string;
	proof: number; //TODO : file
	cause_accident: string;
	head_dep: mongoose.Types.ObjectId;
	hr: mongoose.Types.ObjectId;
	comments: string;
}

const request_schema = new mongoose.Schema(
{
	type: {
		type: String,
		required: true
	},
	concerned: {
		type: String,
		ref: 'users',
		required: true
	},
	state: {
		type: Number,
		required: true,
		default: 0
	},
	days_remote: {
		type: Array
	},
	period_days_remote: {
		type: Array
	},
	start: {
		type: String,
		required: true
	},
	start_isam: {
		type: Boolean,
		required: true
	},
	end: {
		type: String,
		required: true
	},
	end_isam: {
		type: Boolean,
		required: true
	},
	subject_ext: {
		type: String,
	},
	place_ext: {
		type: String
	},
	proof: {
		type: Number
	},
	cause_accident: {
		type: String
	},
	head_dep: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
		required: true
	},
	hr: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
		required: true
	},
	comments: {
		type: String
	}
}, { timestamps: true });

export const Request = mongoose.model('requests', request_schema);

export async function get(filter: any): Promise<RequestInterface[] | null>
{
	console.log("get-request");
	return await Request.find(filter);
}

export async function remove(filter: any)
{
	await Request.findOneAndRemove(filter);
}

export type RequestData = {
	type: string;
	concerned: String;
	state: number;
	days_remote: String[];
	period_days_remote: Number[];
	start: String;
	start_isam: Boolean;
	end: String;
	end_isam: Boolean;
	subject_ext: string;
	place_ext: string;
	proof: number; //TODO : file
	cause_accident: string;
	head_dep: User.UserData;
	hr: User.UserData;
	comments: string;
}

export async function get_data(request: RequestInterface): Promise<RequestData>
{
	// check if the users are in the db
	// let concerned = await User.get({email: request.concerned});
	let head_dep = await User.get({_id: request.head_dep});
	let hr = await User.get({_id: request.hr});

	// if (!concerned)
	// 	throw new Error(`User (id: ${request.concerned}) not found`);
	if (!head_dep)
		throw new Error(`User (id: ${request.head_dep}) not found`);
	if (!hr)
		throw new Error(`User (id: ${request.hr}) not found`);

	// get the users data
	// let concerned_data = await User.get_data(concerned);
	let head_dep_data = await User.get_data(head_dep);
	let hr_data = await User.get_data(hr);

	return {
		type: request.type,
		concerned: request.concerned,
		state: request.state,
		days_remote: request.days_remote,
		period_days_remote: request.period_days_remote,
		start: request.start,
		start_isam: request.start_isam,
		end: request.end,
		end_isam: request.end_isam,
		subject_ext: request.subject_ext,
		place_ext: request.place_ext,
		proof: request.proof,
		cause_accident: request.cause_accident,
		head_dep: head_dep_data,
		hr: hr_data,
		comments: request.comments,
	};
}

export async function add(data: RequestData): Promise<RequestInterface>
{
	// check if the users are in the db
	let concerned = await User.get({email: data.concerned});
	let head_dep = await User.get({email: data.head_dep.email});
	let hr = await User.get({email: data.hr.email});

	if (!concerned)
		throw new Error(`User (${data.concerned}) not found`);
	if (!head_dep)
		throw new Error(`User (${data.head_dep.email}) not found`);
	if (!hr)
		throw new Error(`User (${data.hr.email}) not found`);

	// get the users data
	let concerned_id = concerned._id;
	let head_dep_id = head_dep._id;
	let hr_id = hr._id;

	const request = new Request({
		type: data.type,
		concerned: concerned_id,
		state: data.state,
		days_remote: data.days_remote,
		period_days_remote: data.period_days_remote,
		start: data.start,
		start_isam: data.start_isam,
		end: data.end,
		end_isam: data.end_isam,
		subject_ext: data.subject_ext,
		place_ext: data.place_ext,
		proof: data.proof, 
		cause_accident: data.cause_accident,
		head_dep: head_dep_id,
		hr: hr_id,
		comments: data.comments,
	});

	console.log("request added !");
	//@ts-ignore
	return await request.save();
}
