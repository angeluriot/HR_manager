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
