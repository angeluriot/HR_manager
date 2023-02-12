import { config } from 'dotenv';
import express from 'express';
import { connect_mongodb } from './utils.js';
import Global from './Global.js';
import * as Client from './client.js';
import cors from 'cors';
import bodyParser from 'body-parser';


config();
const port = process.env.PORT || 3000;

Global.app = express();
Global.app.use(cors());
Global.app.use(express.json());

Client.requests();

async function main()
{
	try
	{
		await connect_mongodb();
	}

	catch (error: any)
	{
		console.log("ERROR:", error.message);
		process.exit(1);
	}

	Global.app.listen(port, () => console.log(`Server running on port ${port}`));
}

main();
