export type DepartmentData = {
	name: string
};

export type UserData = {
	email: string,
	hashed_password: string,
	first_name: string,
	last_name: string,
	department: DepartmentData,
	employees: UserData[]
};

export type RequestData = {
	type: string;
	concerned: UserData;
	state: number;
	days_remote: String[];
	nb_days_remote: Number;
	start: String;
	start_isam: Boolean;
	end: String;
	end_isam: Boolean;
	subject_ext: string;
	place_ext: string;
	proof: number;
	cause_accident: string;
	head_dep: UserData;
	hr: UserData;
	comments: string;
}