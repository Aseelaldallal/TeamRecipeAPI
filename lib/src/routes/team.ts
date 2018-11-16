/* ------------------------------------- */
/* -----------------SETUP--------------- */
/* ------------------------------------- */

import * as express from 'express';
import 'express-async-errors';
import { passport } from '../config/passport';
import { Team, ITeamModel, ITeam } from '../models/team';
import { IUserModel } from '../models/user';

export const router = express.Router();

/* ------------------------------------- */
/* --------------INDEX ROUTE------------ */
/* ------------------------------------- */

router.get('/', async (req, res) => {
	const teams = await Team.find();
	res.json(teams);
});

/* ------------------------------------- */
/* -------------CREATE ROUTE------------ */
/* ------------------------------------- */

router.post(
	'/new',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const team: ITeam = {
			name: req.body.name,
			admin: {
				id: (req.user as IUserModel).id,
				username: (req.user as IUserModel).username
			},
			members: [],
			recipes: []
		};
		const teamDocument = new Team(team);
		res.status(200).json(await teamDocument.save());
	}
);

/* ------------------------------------- */
/* ---------------NEW ROUTE------------- */
/* ------------------------------------- */

/* ------------------------------------- */
/* ---------------SHOW ROUTE------------ */
/* ------------------------------------- */

/* ------------------------------------- */
/* ---------------EDIT ROUTE------------ */
/* ------------------------------------- */

/* ------------------------------------- */
/* --------------UPDATE ROUTE----------- */
/* ------------------------------------- */

/* ------------------------------------- */
/* -------------DESTROY ROUTE----------- */
/* ------------------------------------- */

/* ------------------------------------- */
/* ---------------HELPER---------------- */
/* ------------------------------------- */
