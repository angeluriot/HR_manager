import express from 'express';

export default class Global
{
	static app: express.Express;
	static token_nb_days: number = 365;
}
