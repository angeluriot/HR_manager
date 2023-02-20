import express, { query } from 'express';
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

	Global.app.post('/save-request', async (req: express.Request, res: express.Response) =>
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

		let request_data = req.body;

		if (request_data.author.email !== email)
		{
			res.status(400).send("Invalid token");
			return;
		}

		try
		{
			var request = await Request.add(req.body);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		console.log(`Request saved by ${request.author} with id: ${request.id}`);
		res.send({ message: "Request saved" });
	});

	Global.app.post('/send-request', async (req: express.Request, res: express.Response) =>
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

		let request_data = req.body;

		if (request_data.author.email !== email)
		{
			res.status(400).send("Invalid token");
			return;
		}

		try
		{
			var request = await Request.add(req.body);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		// TODO: Notifications and stuff

		console.log(`Request sent by ${request.author} with id: ${request.id}`);
		res.send({ message: "Request sent" });
	});

	Global.app.post('/accept-request', async (req: express.Request, res: express.Response) =>
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

		let request = await Request.get({_id: req.query.id});

		if (!request) {
			res.status(400).send("Request not found");
			return;
		}

		//get the current user, and the user we are validating the request
		let current_user = await User.get({email: email});
		let user = await User.get({email: request?.author});

		//Check if current user is the manager of the person or from Human Ressources
		if ( user?.manager !== email && current_user?.department!== "HR") 
		{
			res.status(400).send("Invalid token");
			return;
		}

		try
		{
			//manager validation
			if(user?.manager == email)
			{
				request.manager = email;
				req.body.accept ? request.state="Validée manager" : request.state="Refusée";
			}
			//HR validation
			else if(current_user?.department == "HR")
			{
				request.hr = email;
				req.body.accept ? request.state="Validée RH" : request.state="Refusée";
			}

			request.save();
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		// TODO: Notifications and stuff

		console.log(`Request answered by ${email} with id: ${request?.id}`);
		res.send({ message: "Request answered" });
	});

	Global.app.get('/user-requests', async (req, res) =>
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

		let requests = await Request.getAll({ author: email }) ?? [];
		let requests_data = [];

		for (let request of requests)
			requests_data.push(await Request.get_data(request));

		res.send(JSON.stringify(requests_data));
	});

	Global.app.get('/manager-requests', async (req, res) =>
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

		let users = await User.getAll({ manager: email }) ?? [];
		let requests = await Request.getAll({ author: { $in: users.map(user => user.email) }, state: "En attente"}) ?? [];
		let requests_data = [];

		for (let request of requests)
			requests_data.push(await Request.get_data(request));

		res.send(JSON.stringify(requests_data));
	});

	Global.app.get('/HR-requests', async (req, res) =>
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

		//All requests exept mines, and those which need manager approval
		let requests = await Request.getAll({author: {$ne:email}, state: "Validée manager"}) ?? [];
		let requests_data = [];

		for (let request of requests)
			requests_data.push(await Request.get_data(request));

		res.send(JSON.stringify(requests_data));
	});

	Global.app.get('/calendar-requests', async (req, res) =>
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

		let current_user = await User.get({email: email});
		let requests: Request.RequestInterface[];

		//HR sees all the sent requests
		if(current_user?.department == "HR")
		{
			requests = await Request.getAll({state: {$ne:"Brouillon"}}) ?? [];
		}
		//All my requests and requests of people I manage
		else
		{
			let users = await User.getAll({ manager: email }) ?? [];
			let manager_requests = await Request.getAll({ author: { $in: users.map(user => user.email) }, state: {$ne:"Brouillon"} }) ?? [];
			let my_requests = await Request.getAll({ author: email, state: {$ne:"Brouillon"} }) ?? [];
			requests = [...manager_requests, ...my_requests];
		}

		let requests_data = [];

		//Select only the requests in the displayed period of time
		for (let request of requests)
		{
			let start = request.start.day;
			let end = request.end.day;

			let formatted_start = new Date(start.split("/").reverse().join("-"));
			let formatted_end = new Date(end.split("/").reverse().join("-"));

			if (typeof req.query.start === "string" && typeof req.query.end === "string" ) 
			{
				let calendar_start = new Date(req.query.start);
				let calendar_end = new Date(req.query.end);

				if(formatted_start < calendar_end && formatted_end > calendar_start)
				{
					requests_data.push(await Request.get_data(request));
				}
			}
		}		
		res.send(JSON.stringify(requests_data));
	});	
}
