export type UserData = {
	email: string,
	hashed_password: string,
	first_name: string,
	last_name: string,
	department: string,
	manager: string
};

export type RequestData = {
	id: string,
	type: string,
	author: { email: string, first_name: string, last_name: string, department: string },
	state: string,
	manager: { email: string, first_name: string, last_name: string } | null,
	hr: { email: string, first_name: string, last_name: string } | null,
	start: { day: string, pm: boolean },
	end: { day: string, pm: boolean },
	remote: { day: string, am: boolean, pm: boolean }[],
	subject: string,
	place: string,
	proof: string,
	cause: string,
	comment: string
}

export type NotificationData = {
	id: string,
	owner: { email: string, first_name: string, last_name: string, department: string },
	request: RequestData,
	text: string
}
