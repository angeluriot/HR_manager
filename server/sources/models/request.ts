import mongoose from 'mongoose';
import type { UserData } from './user.js';
import * as User from './user.js';

export interface RequestInterface extends mongoose.Document
{
	type: string;
	author: string;
	state: string;
	manager: string;
	hr: string;
	start: { day: string, pm: boolean };
	end: { day: string, pm: boolean };
	remote: { day: string, am: boolean, pm: boolean }[];
	subject: string;
	place: string;
	proof: string;
	cause: string;
	comment: string;
}

const request_schema = new mongoose.Schema(
{
	type: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	manager: {
		type: String,
		default: ""
	},
	hr: {
		type: String,
		default: ""
	},
	start: {
		type: { day: String, pm: Boolean },
		required: true
	},
	end: {
		type: { day: String, pm: Boolean },
		required: true
	},
	remote: {
		type: [{ day: String, am: Boolean, pm: Boolean }],
		default: []
	},
	subject: {
		type: String,
		default: ""
	},
	place: {
		type: String,
		default: ""
	},
	proof: {
		type: String,
		default: ""
	},
	cause: {
		type: String,
		default: ""
	},
	comment: {
		type: String,
		default: ""
	}
}, { timestamps: true });

export const Request = mongoose.model('requests', request_schema);

export async function get(filter: any): Promise<RequestInterface | null>
{
	return await Request.findOne(filter);
}

export async function getAll(filter: any): Promise<RequestInterface[] | null>
{
	return await Request.find(filter);
}

export async function remove(filter: any)
{
	await Request.findOneAndRemove(filter);
}

export type RequestData = {
	type: string,
	author: { email: string, first_name: string, last_name: string, department: string },
	state: string,
	manager: { email: string, first_name: string, last_name: string } | null,
	hr: { email: string, first_name: string, last_name: string } | null,
	start: { day: string, pm: boolean },
	end: { day: string, pm: boolean },
	remote: { day: string, am: boolean, pm: boolean }[],
	subject: string,
	place: string,
	proof: string,
	cause: string,
	comment: string
}

export async function get_data(request: RequestInterface): Promise<RequestData>
{
	let author = await User.get({ email: request.author });

	if (!author)
		throw new Error("Author not found");

	let author_data = User.get_data(author);
	let manager_data = null;

	if (request.manager != "")
	{
		var manager = await User.get({ email: request.manager });

		if (!manager)
			throw new Error("Manager not found");

		manager_data = User.get_data(manager);
	}

	let hr_data = null;

	if (request.hr != "")
	{
		var hr = await User.get({ email: request.hr });

		if (!hr)
			throw new Error("HR not found");

		hr_data = User.get_data(hr);
	}

	return {
		type: request.type,
		author: { email: author_data.email, first_name: author_data.first_name, last_name: author_data.last_name, department: author_data.department },
		state: request.state,
		manager: manager_data ? { email: manager_data.email, first_name: manager_data.first_name, last_name: manager_data.last_name } : null,
		hr: hr_data ? { email: hr_data.email, first_name: hr_data.first_name, last_name: hr_data.last_name } : null,
		start: { day: request.start.day, pm: request.start.pm },
		end: { day: request.end.day, pm: request.end.pm },
		remote: request.remote.map(e => { return { day: e.day, am: e.am, pm: e.pm } }),
		subject: request.subject,
		place: request.place,
		proof: request.proof,
		cause: request.cause,
		comment: request.comment
	};
}

export async function add(data: RequestData): Promise<RequestInterface>
{
	const request = new Request({
		type: data.type,
		author: data.author.email,
		state: data.state,
		manager: data.manager ? data.manager.email : "",
		hr: data.hr ? data.hr.email : "",
		start: data.start,
		end: data.end,
		remote: data.remote,
		subject: data.subject,
		place: data.place,
		proof: data.proof,
		cause: data.cause,
		comment: data.comment
	});

	//@ts-ignore
	return await request.save();
}
