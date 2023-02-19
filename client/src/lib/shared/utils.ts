export function date_to_string(date: Date)
{
	let day = date.getDate().toString();
	let month = (date.getMonth() + 1).toString();
	let year = date.getFullYear().toString();

	if (day.length == 1)
		day = "0" + day;

	if (month.length == 1)
		month = "0" + month;

	return day + "/" + month + "/" + year;
}

export function string_to_date(date: string)
{
	let day = parseInt(date.substring(0, 2));
	let month = parseInt(date.substring(3, 5));
	let year = parseInt(date.substring(6, 10));

	return new Date(year, month - 1, day);
}
