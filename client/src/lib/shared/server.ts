import Global from './Global.js';
import type * as Types from './types.js';
import * as Cookie from './cookie.js';

export function logout()
{
	Global.user = null;
	Global.nb_notifications = 0;
	Global.request_pending = false;

	Cookie.erase_token();
	window.location.href = "#/login";
}

export async function login(email: string, password: string): Promise<any>
{
	try
	{
		var response = await fetch(Global.server_url + "login?" + new URLSearchParams({ email, password }));
	}

	catch (error: any)
	{
		throw new Error("Connection error.");
	}

	if (!response.ok)
		throw new Error(await response.text());

	let connection_data = await response.json();

	Cookie.save_token(connection_data.token, connection_data.expires);

	Global.user = connection_data.user;
	Global.days_left = connection_data.days_left;
	Global.nb_notifications = connection_data.nb_notifications;

	window.location.href = "#/";
}

export async function auto_login()
{
	let token = Cookie.get_token();

	if (!token)
	{
		logout();
		return;
	}

	try
	{
		var response = await fetch(Global.server_url + "auto-login?" + new URLSearchParams({ token }));
	}

	catch (error: any)
	{
		logout();
		return;
	}

	if (!response.ok)
	{
		logout();
		return;
	}

	let connection_data = await response.json();

	Global.user = connection_data.user;
	Global.days_left = connection_data.days_left;
	Global.nb_notifications = connection_data.nb_notifications;
}

export async function get(url: string, params: any = {})
{
	let token = Cookie.get_token();

	if (!token)
	{
		logout();
		return;
	}

	try
	{
		let temp = new URLSearchParams({ token }) + (params ? '&' + new URLSearchParams(params) : '');
		var response = await fetch(Global.server_url + url + "?" + temp);
	}

	catch (error: any)
	{
		throw new Error("Connection error.");
	}

	if (!response.ok)
		throw new Error(await response.text());

	return await response.json();
}

export async function post(url: string, params: any, body: any)
{
	let token = Cookie.get_token();

	if (!token)
	{
		logout();
		return;
	}

	let temp = new URLSearchParams({ token }) + (params ? '&' + new URLSearchParams(params) : '');

	try
	{
		var response = await fetch(Global.server_url + url + "?" + temp,
		{
			method: "POST",
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(body)
		});
	}

	catch (error: any)
	{
		throw new Error("Connection error.");
	}

	if (!response.ok)
		throw new Error(await response.text());

	return await response.json();
}

export async function update_info()
{
	let data = await get("update-info");

	Global.days_left = data.days_left;
	Global.rtt_left = data.rtt_left;
	Global.nb_notifications = data.nb_notifications;
}
