/* ------------------------------------- */
/* -----------------SETUP--------------- */
/* ------------------------------------- */

import * as express from 'express';
import 'express-async-errors';
import { passport } from '../config/passport';
import { Team, ITeam } from '../models/team';
import { User, IUserModel } from '../models/user';
import { CustomError } from '../shared/Error';
import { Recipe } from 'src/models/recipe';

export const router = express.Router();

/* ------------------------------------- */
/* --------------INDEX ROUTE------------ */
/* ------------------------------------- */

router.get('/', async (req: express.Request, res: express.Response) => {
	const teams = await Team.find();
	res.json(teams);
});

/* ------------------------------------- */
/* -------------CREATE ROUTE------------ */
/* ------------------------------------- */

router.post(
	'/new',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
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

// Change Admin
router.patch(
	'/:teamId/makeAdmin',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		const team = await Team.findById(req.params.teamId);
		if (!team) {
			throw new CustomError('BadRequest', 'Team does not exist', 403);
		}
		if (req.user.id !== team.admin.id) {
			throw new CustomError('Forbidden', 'Only Team Admin can edit team', 403);
		}
		const newAdmin = await User.findById(req.body.userId);
		if (!newAdmin) {
			throw new CustomError('BadRequest', `Cannot find user ${req.params.userId}`, 403);
		}
		if (newAdmin.id !== team.admin.id) {
			// Ensure new admin is already part of team
			const oldAdmin = team.admin;
			const adminInTeam = !!team.members.filter(member => member.id === newAdmin.id);
			if (!adminInTeam) {
				throw new CustomError('Forbidden', 'New Admin Must be Part of Team', 403);
			}
			// Remove new admin user from members
			team.members = team.members.filter(member => member.id !== newAdmin.id);
			// Add old admin user him to members
			team.members.push(oldAdmin);
			// Make new admin user admin
			team.admin = { id: newAdmin.id, username: newAdmin.username };
		}
		const updatedTeam = await team.save();
		res.json(updatedTeam);
	}
);

// Change Team Name
router.patch(
	'/:teamId/name',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		const team = await Team.findById(req.params.teamId);
		if (!team) {
			throw new CustomError('BadRequest', 'Team does not exist', 403);
		}
		if (req.user.id !== team.admin.id) {
			throw new CustomError('Forbidden', 'Only Team Admin can edit team', 403);
		}
		team.name = req.body.name;
		const updatedTeam = await team.save();
		res.json(updatedTeam);
	}
);

// Add Member
router.patch(
	'/:teamId/addMember',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		const team = await Team.findById(req.params.teamId);
		if (!team) {
			throw new CustomError('BadRequest', 'Team does not exist', 403);
		}
		if (req.user.id !== team.admin.id) {
			throw new CustomError('Forbidden', 'Only Team Admin can edit team', 403);
		}
		const { member } = req.body;
		const user = await User.findById(member.id);
		if (!user) {
			throw new CustomError('BadRequest', 'Can only add existing user to team', 400);
		}
		team.members.push(member);
		const updatedTeam = await team.save();
		res.json(updatedTeam);
	}
);

// Remove Member
router.patch(
	'/:teamId/removeMember',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		const team = await Team.findById(req.params.teamId);
		if (!team) {
			throw new CustomError('BadRequest', 'Team does not exist', 403);
		}
		if (req.user.id !== team.admin.id) {
			throw new CustomError('Forbidden', 'Only Team Admin can edit team', 403);
		}
		const memberToRemove = req.body.member;
		const members = team.members.filter(member => member.id !== memberToRemove.id);
		team.members = members;
		const updatedTeam = await team.save();
		res.json(updatedTeam);
	}
);

// Add Recipe
router.patch(
	'/:teamId/addRecipe',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		const team = await Team.findById(req.params.teamId);
		if (!team) {
			throw new CustomError('BadRequest', 'Team does not exist', 400);
		}
		if (req.user.id !== team.admin.id) {
			throw new CustomError('Forbidden', 'Only Team Admin can edit team', 403);
		}
		const { recipe } = req.body;
		const recipeToAdd = await Recipe.findById(recipe.id);
		if (!recipe) {
			throw new CustomError('BadRequest', `Recipe ${recipe.id} does not exist`, 400);
		}
		team.recipes.push({ id: recipeToAdd.id, name: recipeToAdd.name });
		const updatedTeam = await team.save();
		res.json(updatedTeam);
	}
);

// Remove Recipe
router.patch(
	'/:teamId/removeMember',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		const team = await Team.findById(req.params.teamId);
		if (!team) {
			throw new CustomError('BadRequest', 'Team does not exist', 403);
		}
		if (req.user.id !== team.admin.id) {
			throw new CustomError('Forbidden', 'Only Team Admin can edit team', 403);
		}
		const recipeToRemove = req.body.recipe;
		const recipes = team.recipes.filter(member => member.id !== recipeToRemove.id);
		team.recipes = recipes;
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
