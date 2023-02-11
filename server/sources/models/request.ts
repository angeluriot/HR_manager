import mongoose from 'mongoose';
import * as User from './user.js';


export interface RequestInterface extends mongoose.Document
{
	type: number;
	concerned: mongoose.Types.ObjectId;
	state: number;
	days_remote: [Array<String>, number]; // [Array des jours de télétravail, nombre de répétitions]
	start: [Date, boolean]; // [Date, 0 pour matin / 1 pour aprem]
    end: [Date, boolean];
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
		type: Number,
		required: true
	},
	concerned: {
		type: mongoose.Types.ObjectId,
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
	start: {
		type: Date,
		required: true
	},
    end: {
		type: Date,
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

export async function get(filter: any): Promise<RequestInterface | null>
{
	return await Request.findOne(filter);
}

export async function remove(filter: any)
{
	await Request.findOneAndRemove(filter);
}

export type RequestData = {
	type: number;
	concerned: User.UserData;
	state: number;
	days_remote: [Array<String>, Number];
	start: [Date, boolean]; // [Date, 0 pour matin / 1 pour aprem]
    end: [Date, boolean];
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
    let concerned = await User.get({_id: request.concerned});
    let head_dep = await User.get({_id: request.head_dep});
    let hr = await User.get({_id: request.hr});
    if (!concerned)
    throw new Error(`User (id: ${request.concerned.toString()}) not found`);
    if (!head_dep)
    throw new Error(`User (id: ${request.head_dep.toString()}) not found`);
    if (!hr)
    throw new Error(`User (id: ${request.hr.toString()}) not found`);

    // get the users data
    let concerned_data = await User.get_data(concerned);
	let head_dep_data = await User.get_data(head_dep);
	let hr_data = await User.get_data(hr);

	return {
        type: request.type,
        concerned: concerned_data,
        state: request.state,
        days_remote: request.days_remote,
        start: request.start, // [Date, 0 pour matin / 1 pour aprem]
        end: request.end,
        subject_ext: request.subject_ext,
        place_ext: request.place_ext,
        proof: request.proof, //TODO : file
        cause_accident: request.cause_accident,
        head_dep: head_dep_data,
        hr: hr_data,
        comments: request.comments,
	};
}

export async function add(data: RequestData): Promise<RequestInterface>
{
    // check if the users are in the db
    let concerned = await User.get({email: data.concerned.email});
    let head_dep = await User.get({email: data.head_dep.email});
    let hr = await User.get({email: data.hr.email});
    if (!concerned)
    throw new Error(`User (${data.concerned.email.toString()}) not found`);
    if (!head_dep)
    throw new Error(`User (${data.head_dep.email.toString()}) not found`);
    if (!hr)
    throw new Error(`User (${data.hr.email.toString()}) not found`);

    // get the users data
    let concerned_id = concerned._id;
	let head_dep_id = head_dep._id;
	let hr_id = hr._id;

	const request = new Request({
        type: data.type,
        concerned: concerned_id,
        state: data.state,
        days_remote: data.days_remote,
        start: data.start, // [Date, 0 pour matin / 1 pour aprem]
        end: data.end,
        subject_ext: data.subject_ext,
        place_ext: data.place_ext,
        proof: data.proof, //TODO : file
        cause_accident: data.cause_accident,
        head_dep: head_dep_id,
        hr: hr_id,
        comments: data.comments,
	});

    console.log("request added !");
	//@ts-ignore
	return await request.save();
}
