import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Users from '../models/user.js';
import * as Notification from '../models/notification.js';
import Global from '../Global.js';
import * as Utils from '../utils.js';

export function verify_token(token: any): string
{
	if (!token || typeof token != 'string' || token.trim() == '')
		throw new Error("Empty token.");

	token = token.trim();

	try
	{
		var payload = jwt.verify(token, process.env.TOKEN_SECRET as any) as any;
	}

	catch (error: any)
	{
		if (error instanceof jwt.JsonWebTokenError)
			throw new Error("Invalid token.");

		if (error instanceof jwt.TokenExpiredError)
			throw new Error("Expired token.");

		throw error;
	}

	return payload.data;
}

export async function login(email: any, password: any, ip: string)
{
	if (!email || !password || typeof email != 'string' || typeof password != 'string' || email.trim() == '' || password.trim() == '')
		throw new Error('Missing email or password.');

	email = email.trim();
	password = password.trim();

	let user = await Users.get({ email: email });

	if (!user)
		throw new Error('This user does not exist.');

	let result = await bcrypt.compare(password, user.hashed_password)

	if (!result)
		throw new Error('Wrong password.');

	let date = new Date();
	date.setDate(date.getDate() + Global.token_nb_days);

	let token = jwt.sign({ data: email }, process.env.TOKEN_SECRET as any, { expiresIn: Global.token_nb_days.toString() + ' days' })

	console.log('[' + new Date().toTimeString().split(' ')[0] + '] User logged (' + ip + ') : ' + email);

	let notifications = await Notification.getAll({owner: email}) ?? [];

	return {
		token: token,
		expires: date.toUTCString(),
		user: Users.get_data(user),
		days_left: await Utils.get_days_left(email),
		rtt_left: 0,
		nb_notifications: notifications.length
	};
}

export async function auto_login(token: any, ip: string)
{
	let email = verify_token(token);
	let user = await Users.get({ email: email });

	if (!user)
		throw new Error('This user does not exist.');

	console.log('[' + (new Date()).toTimeString().split(' ')[0] + '] User auto logged (' + ip + ') : ' + email);

	let notifications = await Notification.getAll({owner: email}) ?? [];

	return {
		user: Users.get_data(user),
		days_left: await Utils.get_days_left(email),
		rtt_left: 0,
		nb_notifications: notifications.length
	};
}
