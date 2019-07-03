/* ------------------------------------- */
/* -----------------SETUP--------------- */
/* ------------------------------------- */

import * as express from 'express';
import 'express-async-errors';
import { passport } from '../config/passport';
import { Team, ITeamModel, ITeam } from '../models/team';
import { IUserModel } from '../models/user';
import { CustomError } from '../shared/Error';

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

// Logged in user can only edit team if he/she is admin
// We can change the name of the team
// We can change the admin of the team --> has to be a valid user
// New admin has to be a valid user
// New admin has to be part of team already
// Must remove old admin and put him in team
// Must remove new admin from team and put him in admin
// We can add/remove team members
// We can add/remove recipes
router.put(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		// User must be team admin
		const team = await Team.findById(req.params.id);
		if (req.user.id !== team.admin.id) {
			throw new CustomError('Forbidden', 'Only Team Admin can edit team', 403);
		}
		team.name = req.body.name;
		team.members = req.body.members;
		team.recipes = req.body.recipes;
		// Handle Changing of Admins
		if (req.body.admin && req.body.admin.id !== team.admin.id) {
			// Ensure new admin is already part of team
			const oldAdmin = team.admin;
			const newAdmin = req.body.admin;
			const adminInTeam = !!team.members.filter(member => member.id === newAdmin.id);
			if (!adminInTeam) {
				throw new CustomError('Forbidden', 'New Admin Must be Part of Team', 403);
			}
			// Remove new admin user from members
			team.members = team.members.filter(member => member.id !== newAdmin.id);
			// Add old admin user him to members
			team.members.push(oldAdmin);
			// Make new admin user admin
			team.admin = newAdmin;
		}
		const updatedTeam = await team.save();
		res.json(updatedTeam);
	}
);

/* ------------------------------------- */
/* -------------DESTROY ROUTE----------- */
/* ------------------------------------- */

/* ------------------------------------- */
/* ---------------HELPER---------------- */
/* ------------------------------------- */
