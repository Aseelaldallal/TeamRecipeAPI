import * as express from 'express';
import { Team, ITeam } from '../models/team';
import { IUserDocument } from 'src/models/user';

export const getTeam = async (req: express.Request, res: express.Response) => {
	const teams = await Team.find();
	res.json(teams);
};

export const createTeam = async (req: express.Request, res: express.Response) => {
	const team: ITeam = {
		name: req.body.name,
		admin: {
			id: (req.user as IUserDocument).id,
			username: (req.user as IUserDocument).username
		},
		members: [],
		recipes: []
	};
	const teamDocument = new Team(team);
	res.status(200).json(await teamDocument.save());
};
