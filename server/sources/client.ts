import express from 'express';
import Global from './Global.js';
import * as Connection from './users/connection.js';
import fs from 'fs';
import * as Request from './models/request.js';
import * as User from './models/user.js';
import * as Notification from './models/notification.js';
import { ObjectId } from 'mongodb'
import * as Utils from './utils.js';

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

	Global.app.get('/update-info', async (req: express.Request, res: express.Response) =>
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

		let notifications = await Notification.getAll({owner: email}) ?? [];

		res.send(JSON.stringify({
			days_left: await Utils.get_days_left(email),
			rtt_left: 0,
			nb_notifications: notifications.length
		}));
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

		let author = await User.get({ email: email }); // get the author of the request
		let manager = await User.get({ email: author?.manager }); // get the manager of the author

		// Notification to manager of the request
		if (manager !== null && author !== null)
		{
			let notification: Notification.NotificationData = {
				id: "",
				owner : {
					email: manager.email,
					first_name: manager.first_name,
					last_name: manager.last_name,
					department: manager.department
				},
				request: await Request.get_data(request),
				text: "Nouvelle demande de " + author.first_name + " " + author.last_name + " (" + author.department + ")"
			}

			await Notification.add(notification);
		}

		console.log(`Request sent by ${request.author} with id: ${request.id}`);
		res.send({ message: "Request sent" });
	});

	Global.app.post('/update-draw', async (req: express.Request, res: express.Response) =>
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

		if(req.query.update === "delete"){
			await Request.remove({_id: request_data.to_remove});
			return;
		}

		if (request_data.author.email !== email)
		{
			res.status(400).send("Invalid token");
			return;
		}

		try
		{
			await Request.remove({_id: request_data.to_remove});
			var request = await Request.add(request_data.to_add);
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		let author = await User.get({ email: email }); // get the author of the request
		let manager = await User.get({ email: author?.manager }); // get the manager of the author

		// Notification to manager of the request
		if (manager !== null && author !== null)
		{
			let notification: Notification.NotificationData = {
				id: "",
				owner : {
					email: manager.email,
					first_name: manager.first_name,
					last_name: manager.last_name,
					department: manager.department
				},
				request: await Request.get_data(request),
				text: "Nouvelle demande de " + author.first_name + " " + author.last_name + " (" + author.department + ")"
			}

			await Notification.add(notification);
		}

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

		if (!request)
		{
			res.status(400).send("Request not found");
			return;
		}

		// Get the current user, and the user we are validating the request
		let current_user = await User.get({email: email});
		let user = await User.get({email: request.author});

		// Check if current user is the manager of the person or from Human Ressources
		if (!user || user.manager !== email && current_user?.department !== "RH")
		{
			res.status(400).send("Invalid token");
			return;
		}

		try
		{
			// Manager validation
			if(user.manager == email)
			{
				request.manager = email;

				if (req.body.accept)
				{
					request.state = "En attente";

					// Notification to all HR to validate
					let HRs = await User.getAll({ department: "RH" });

					if (HRs !== null)
						for (let hr of HRs)
							if (request !== null)
							{
								let notification: Notification.NotificationData = {
									id: "",
									owner : {
										email: hr.email,
										first_name: hr.first_name,
										last_name: hr.last_name,
										department: hr.department
									},
									request: await Request.get_data(request),
									text: "Nouvelle demande de " + user.first_name + " " + user.last_name + " (" + user.department + ")"
								}

								await Notification.add(notification);
							}
				}

				else
					request.state = "Refusée";
			}

			// HR validation
			else if (current_user?.department == "RH")
			{
				request.hr = email;

				if (req.body.accept)
					request.state = "Validée";
				else
					request.state = "Refusée";
			}

			request.save();
		}

		catch (error: any)
		{
			res.status(400).send(error.message);
			return;
		}

		// Notification to author of the request
		if (user !== null && request.state !== "En attente")
		{
			let notification: Notification.NotificationData = {
				id: "",
				owner: {
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name,
					department: user.department
				},
				request: await Request.get_data(request),
				text: request.state == "Validée" ? "Votre demande a été acceptée !" : "Votre demande a été refusée"
			}

			await Notification.add(notification);
		}

		console.log(`Request answered by ${email} with id: ${request.id}`);
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
		let requests = await Request.getAll({ author: { $in: users.map(user => user.email) }, state: "En attente", manager: ""}) ?? [];
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
		let requests = await Request.getAll({author: {$ne:email}, state: "En attente", manager: {$ne:""}, hr: ""}) ?? [];
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

		//HR sees all the sent requests exept draws and refused
		if(current_user?.department == "RH")
		{
			if(req.query.department !== "")
			{
				let users = await User.getAll({department: req.query.department}) ?? [];
				requests = await Request.getAll({ author: { $in: users.map(user => user.email) }, state: { $nin: ["Brouillon", "Refusée"] } }) ?? [];
			}
			else
			{
				requests = await Request.getAll({ state: { $nin: ["Brouillon", "Refusée"] } }) ?? [];
			}
					
		}
		//All my requests and requests of people I manage
		else
		{
			let users = await User.getAll({ manager: email }) ?? [];
			let manager_requests = await Request.getAll({ author: { $in: users.map(user => user.email) }, state: { $nin: ["Brouillon", "Refusée"] } }) ?? [];
			let my_requests = await Request.getAll({ author: email, state: { $nin: ["Brouillon", "Refusée"] } }) ?? [];
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

	Global.app.get('/request-id', async (req, res) =>
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

		let request_id = new ObjectId(req.query.id?.toString());
		let request = await Request.get({ _id : request_id });

		res.send(JSON.stringify(request));
	});

	Global.app.get('/user-notifications', async (req, res) =>
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
		let notifications = await Notification.getAll({owner: email}) ?? [];
		let notifications_data = [];

		for (let notif of notifications)
			notifications_data.push(await Notification.get_data(notif));

		res.send(JSON.stringify(notifications_data));
	});

	Global.app.post('/delete-notification', async (req, res) =>
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

		let notification = await Notification.get({_id: req.query.id});

		if	(notification?.owner !== email)
		{
			res.status(400).send("You can't delete this notification");
			return;
		}

		notification.delete();

		res.send(JSON.stringify({ message: "Notification deleted" }));
	});

	Global.app.get('/work-accident-requests', async (req, res) =>
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

        let requests = await Request.getAll({type : "Accident du travail", state : "Validée"}) ?? [];
        let requests_data = [];

        for (let request of requests)
            requests_data.push(await Request.get_data(request));

        res.send(JSON.stringify(requests_data));
    });

    Global.app.get('/sickness-requests', async (req, res) =>
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

        let requests = await Request.getAll({type : "Arrêt maladie", state : "Validée"}) ?? [];
        let requests_data = [];

        for (let request of requests)
            requests_data.push(await Request.get_data(request));

        res.send(JSON.stringify(requests_data));
    });

    Global.app.get('/remote-work-requests', async (req, res) =>
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

        let requests = await Request.getAll({type : "Télétravail", state : "Validée"}) ?? [];
        let requests_data = [];

        for (let request of requests)
            requests_data.push(await Request.get_data(request));

        res.send(JSON.stringify(requests_data));
    });

    Global.app.get('/users', async (req, res) =>
    {
        let users = await User.getAll({}) ?? [];
        let users_data = [];

        for (let user of users)
            users_data.push(await User.get_data(user));

        res.send(JSON.stringify(users_data));
    });
}
