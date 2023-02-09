export function get_token(): string | null
{
	let cookies = document.cookie.split(';');
	let token = '';

	for (let i = 0; i < cookies.length; i++)
		if (cookies[i].includes('token='))
			token = cookies[i];

	if (token == '')
		return null;

	return decodeURIComponent(token.substring(token.indexOf('token=') + 6));
}

export function save_token(token: string, expiration: string)
{
	let value = 'token=' + encodeURIComponent(token);
	let expires = '; expires=' + expiration;
	document.cookie = value + expires + '; Secure' + '; path=/;';
}

export function erase_token()
{
	document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 UTC; ; Secure; path=/;';
}
