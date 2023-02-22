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

		console.log(`Request sended by ${request.author} with id: ${request.id}`);
		res.send({ message: "Request sended" });
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

    		let notif_text : string = "";
    		try
    		{
    			//manager validation
    			if(user?.manager == email)
    			{
    				request.manager = email;
    				if (req.body.accept) {
    					request.state="En attente";
    					notif_text = "Validée par manager : " + email;

    					// Notification to all HR to validate
    					let HRs = await User.getAll({ department: "HR" });
    					if (HRs !== null) {
    						HRs.forEach(async (hr) => {
    							if (request !== null) {
    								let notification : Notification.NotificationData;
    								notification = {
    									owner : {
    										email: hr.email,
    										first_name: hr.first_name,
    										last_name: hr.last_name,
    										department: hr.department
    									},
    									request: request._id.toString(),
    									text: "Demande de " + user?.first_name + " " + user?.last_name
    								}
    								var notif = await Notification.add(notification);
    							}
    						});
    					}
    				}
    				else {
    					request.state="Refusée";
    					notif_text = "Refusée par manager : " + email;
    				}
    			}
    			//HR validation
    			else if(current_user?.department == "HR")
    			{
    				request.hr = email;
    				if (req.body.accept) {
    					request.state="Validée";
    					notif_text = "Validée par RH : " + email;
    				} else {
    					request.state="Refusée";
    					notif_text = "Refusée par RH : " + email;
    				}
    			}

    			request.save();
    		}

    		catch (error: any)
    		{
    			res.status(400).send(error.message);
    			return;
    		}

    		// Notification to author of the request
    		if (user !== null) {
    			let notification : Notification.NotificationData;
    			notification = {
    				owner : {
    					email: user.email,
    					first_name: user.first_name,
    					last_name: user.last_name,
    					department: user.department
    				},
    				request: request._id.toString(),
    				text: notif_text
    			}
    			var notif = await Notification.add(notification);
    		}

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
		let requests = await Request.getAll({ author: { $in: users.map(user => user.email) } }) ?? [];
		let requests_data = [];

		for (let request of requests)
			requests_data.push(await Request.get_data(request));

		res.send(JSON.stringify(requests_data));
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

        let requests = await Request.getAll({type : "Accident"}) ?? [];
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

        let requests = await Request.getAll({type : "Maladie"}) ?? [];
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

        let requests = await Request.getAll({type : "Télétravail"}) ?? [];
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
    			users_data.push(await Request.get_data(user));

    		res.send(JSON.stringify(users_data));
    	});
}
