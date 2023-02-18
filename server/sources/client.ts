import express from 'express';
import Global from './Global.js';
import * as Connection from './users/connection.js';
import fs from 'fs';
import * as Request from './models/request.js';
import * as User from './models/user.js';

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
			var connection_data = await Connection.auto_login(token, req.ip === "::1" ? "127.0.0.1" : req.ip);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		res.send(JSON.stringify(connection_data));
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
		try
		{
			var email = Connection.verify_token(req.query.token);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		// Check if emal is the same as the one in the request

		try
		{
			var request = await Request.add(req.body);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		console.log("Request created with id:", request.id);
		res.send(JSON.stringify(Request.get_data(request)));
	});

	Global.app.get('/get-requests', async (req, res) => {

		try
		{
			var email = Connection.verify_token(req.query.token);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}
		
		const id = req.query._id; // id du user
		const requests = await Request.get({ _id: id }); // requêtes dont le "concerned" correspond à cet id
		res.json(requests);
	});

	Global.app.get('/get-users-by-manager', async (req, res) => {
		console.log("get-server");
		const email = req.query.email;
		const users = await User.getAll({ manager: email });	
		console.log("hi "+email);
		res.json(users);
	});
}
