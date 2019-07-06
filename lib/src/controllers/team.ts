import * as express from 'express';
import { Team } from '../models/team';

export const getTeam = async (req: express.Request, res: express.Response) => {
	const teams = await Team.find();
	res.json(teams);
};
