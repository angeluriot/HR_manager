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
	type: number;
	concerned: UserData;
	state: number;
	days_remote: Array<String>;
	half_days: Array<[Date, boolean]>; // [Date, 0 pour matin / 1 pour aprem]
	subject_ext: string;
    place_ext: string;
    proof: number; //TODO : file
    cause_accident: string;
    head_dep: UserData;
    hr: UserData;
    comments: string;
}