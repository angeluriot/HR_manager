import type * as Types from './types.js';

export default class Global
{
	static server_url = 'http://localhost:3000/';
	static user: Types.UserData | null = null;
	static rtt_left = 5;
	static days_left = 0;
	static nb_notifications = 0;
	static request_pending = false;
	static displayed: Types.RequestData | null = null;
	static edit: Types.RequestData | null = null;
}
