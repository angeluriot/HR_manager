import type * as Types from './types.js';

export default class Global
{
	static server_url: string = 'http://localhost:3000/';
	static user: Types.UserData = null;
}
