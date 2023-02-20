import mongoose from 'mongoose';
import * as User from './user';
import * as Request from './request';

export interface NotificationInterface extends mongoose.Document
{
	owner: string; // email 
    request: string; // id of request
    text: string; // message (ex: is valid or to valid)
}

const notification_schema = new mongoose.Schema(
{
	owner: {
		type: String,
		required: true
	},
	request: {
		type: String,
		required: true
    },
    text: {
        type: String,
		required: true   
    }
}, { timestamps: true });

export const Notification = mongoose.model('notifications', notification_schema);

export async function get(filter: any): Promise<NotificationInterface | null>
{
	return await Notification.findOne(filter);
}

export async function getAll(filter: any): Promise<NotificationInterface[] | null>
{
	return await Notification.find(filter);
}

export async function remove(filter: any)
{
	await Notification.findOneAndRemove(filter);
}

export type NotificationData = {
	owner: { email: string, first_name: string, last_name: string, department: string },
	request: string,
    text: string
}

export async function get_data(notification: NotificationData): Promise<NotificationData>
{
	let owner = await User.get({ email: notification.owner });
    let request = await Request.get({ _id: notification.request });

	if (!owner)
		throw new Error("Owner not found");
    if (!request)
		throw new Error("Request not found");

	let owner_data = User.get_data(owner);

	return {
		owner: { email: owner_data.email, first_name: owner_data.first_name, last_name: owner_data.last_name, department: owner_data.department },
		request: notification.request,
		text: notification.text,
	};
}

export async function add(data: NotificationData): Promise<NotificationInterface>
{
	const notification = new Notification({
		owner: data.owner.email,
		request: data.request,
		text: data.text,
	});

	//@ts-ignore
	return await notification.save();
}
