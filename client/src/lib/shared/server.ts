import Global from './Global.js';
import type * as Types from './types.js';
import * as Cookie from './cookie.js';

export async function login(email: string, password: string): Promise<{ token: string, expires: string, user_data: Types.UserData }>
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

	return await response.json();
}

export async function auto_login()
{
	let token = Cookie.get_token();

	if (!token)
	{
		window.location.href = "#/login";
		return;
	}

	try
	{
		var response = await fetch(Global.server_url + "auto-login?" + new URLSearchParams({ token }));
	}

	catch (error: any)
	{
		Cookie.erase_token();
		window.location.href = "#/login";
		return;
	}

	if (!response.ok)
	{
		Cookie.erase_token();
		window.location.href = "#/login";
		return;
	}

	Global.user = await response.json();
}

export async function get(url: string, params: any = {})
{
	let token = Cookie.get_token();

	if (!token)
	{
		window.location.href = "#/login";
		return;
	}

	try
	{
		let temp = new URLSearchParams({ token }) + params ? '&' + new URLSearchParams(params) : '';
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
		window.location.href = "#/login";
		return;
	}

	try
	{
		let temp = new URLSearchParams({ token }) + params ? '&' + new URLSearchParams(params) : '';

		var response = await fetch(Global.server_url + url + "?" + temp,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
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
