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
/* ---------------SHOW ROUTE------------ */
/* ------------------------------------- */

router.get('/:id', async (req: express.Request, res: express.Response) => {
	const team = await Team.findById(req.params.id);
	res.json(team);
});

/* ------------------------------------- */
/* --------------UPDATE ROUTE----------- */
/* ------------------------------------- */

// Only logged in admin can edit team
// We can change the name of the team
// We can change the admin of the team --> has to be a valid user
	 // New admin has to be a valid user
	 // New admin has to be part of team already
	 // Must remove old admin and put him in team
	 // Must remove new admin from team and put him in admin
// We can add/remove team members 
// We can add/remove recipes
router.put('/:id', async (req: express.Request, res: express.Response) => {

});

/* ------------------------------------- */
/* -------------DESTROY ROUTE----------- */
/* ------------------------------------- */

/* ------------------------------------- */
/* ---------------HELPER---------------- */
/* ------------------------------------- */
