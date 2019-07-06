import * as express from 'express';
import { celebrate, Joi } from 'celebrate';
import { Team, ITeam } from '../models/team';
import { IUserDocument } from 'src/models/user';

export const getTeam = async (req: express.Request, res: express.Response) => {
	const teams = await Team.find();
	res.json(teams);
};

export const createTeam = async (req: express.Request, res: express.Response) => {
	const newTeam: ITeam = {
		name: req.body.name,
		admin: {
			id: (req.user as IUserDocument).id,
			username: (req.user as IUserDocument).username
		},
		members: [],
		recipes: []
	};
	const team = await new Team(newTeam).save();
	res.status(200).json({ team });
};

export const validate = (methodName: string) => {
	let schema: object;
	switch (methodName) {
		case 'createTeam':
			schema = {
				body: Joi.object().keys({
					name: Joi.string().required()
				})
			};
	}
	return celebrate(schema, { abortEarly: false });
};
