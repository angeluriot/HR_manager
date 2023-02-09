import type * as Types from './types.js';

export default class Global
{
	static server_url = 'http://localhost:3000/';
	static user: Types.UserData | null = null;
	static nb_notifications = 3;
	static request_pending = true;
}
