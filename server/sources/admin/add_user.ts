import * as User from '../models/user.js';
import bcrypt from 'bcrypt';
import { connect_mongodb } from '../utils.js';

async function main()
{
	let email = process.argv[2];
	let password = process.argv[3];

	if (!email || !password || typeof email != 'string' || typeof password != 'string' || email.trim() == '' || password.trim() == '')
	{
		console.error("ERROR: email or password is missing (usage: npm run add-user <email> <password>)");
		process.exit(1);
	}

	email = email.trim();
	password = password.trim();

	try
	{
		await connect_mongodb();
	}

	catch (error: any)
	{
		console.error("ERROR:", error.message);
		process.exit(1);
	}

	let hashed = await bcrypt.hash(password, 10);

	try
	{
		var user = await User.add({
			email: email,
			hashed_password: hashed,
			first_name: 'none',
			last_name: 'none',
			department: 'none',
			manager: 'none'
		});
	}

	catch (error: any)
	{
		console.error("ERROR:", error.message);
		process.exit(1);
	}

	console.log("User created with id:", user.id);
	process.exit(0);
}

main();
