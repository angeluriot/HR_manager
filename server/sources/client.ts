import express from 'express';
import Global from './Global.js';
import * as Connection from './users/connection.js';
import fs from 'fs';
import * as Request from './models/request.js';

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

	Global.app.get('/photo', async (req: express.Request, res: express.Response) =>
	{
		try
		{
			var email = Connection.verify_token(req.query.token);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		let path = "/resources/photos/" + email;

		if (fs.existsSync("." + path + ".png"))
			res.sendFile(path + ".png", { root: '.' });

		else if (fs.existsSync("." + path + ".jpg"))
			res.sendFile(path + ".jpg", { root: '.' });

		else
			res.sendFile("/resources/photos/default.jpg", { root: '.' });
	});

	Global.app.post('/add-request', async (req: express.Request, res: express.Response) =>
	{
		res.header("Access-Control-Allow-Origin", "*");

		if (req.body) {
			console.log(req.body);
			res.send(JSON.stringify({ message: "Body received!" }));
		} else {
			res.status(400).send(JSON.stringify({ message: "No body found in request" }));
		}
		
		try
		{
			var email = Connection.verify_token(req.query.token);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		try 
		{
			var request = await Request.add(req.body);
		}

		catch (error: any)
		{
			console.log("ERROR:", error.message);
			process.exit(1);
		}

		console.log("Request created with id:", request.id);
		res.send(JSON.stringify(request))
		process.exit(0);
	});
}
