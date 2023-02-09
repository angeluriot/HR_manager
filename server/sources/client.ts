import express from 'express';
import Global from './Global.js';
import * as Connection from './users/connection.js';

export function requests()
{
	Global.app.get('/login', async (req: express.Request, res: express.Response) =>
	{
		let email = req.query.email;
		let password = req.query.password;

		try
		{
			var connection_data = await Connection.login(email, password, req.ip === "::1" ? "127.0.0.1" : req.ip);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		res.send(JSON.stringify(connection_data));
	});

	Global.app.get('/auto-login', async (req: express.Request, res: express.Response) =>
	{
		let token = req.query.token;

		try
		{
			var user_data = await Connection.auto_login(token, req.ip === "::1" ? "127.0.0.1" : req.ip);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		res.send(JSON.stringify(user_data));
	});
}
