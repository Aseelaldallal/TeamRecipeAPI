/* ------------------------------------- */
/* -----------------SETUP--------------- */
/* ------------------------------------- */

import * as express from 'express';
import 'express-async-errors';
import { passport } from '../config/passport';
import * as TeamController from '../controllers/team';
import { Team } from '../models/team';
import { Recipe } from '../models/recipe';
import { User } from '../models/user';
import { CustomError } from '../shared/Error';

export const router = express.Router();

/* ------------------------------------- */
/* --------------INDEX ROUTE------------ */
/* ------------------------------------- */

router.get('/', TeamController.getTeams);

/* ------------------------------------- */
/* -------------CREATE ROUTE------------ */
/* ------------------------------------- */

router.post(
	'/new',
	passport.authenticate('jwt', { session: false, failWithError: true }),
	TeamController.validate('createTeam'),
	TeamController.createTeam
);

/* ------------------------------------- */
/* ---------------SHOW ROUTE------------ */
/* ------------------------------------- */

router.get('/:id', TeamController.getTeam);

/* ------------------------------------- */
/* --------------UPDATE ROUTE----------- */
/* ------------------------------------- */

router.patch(
	'/:teamId/updateAdmin',
	passport.authenticate('jwt', { session: false, failWithError: true }),
	TeamController.validate('updateAdmin'),
	TeamController.updateAdmin
);

// Change Team Name
router.patch(
	'/:teamId/name',
	passport.authenticate('jwt', { session: false, failWithError: true }),
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
	passport.authenticate('jwt', { session: false, failWithError: true }),
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
	passport.authenticate('jwt', { session: false, failWithError: true }),
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
	passport.authenticate('jwt', { session: false, failWithError: true }),
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
	passport.authenticate('jwt', { session: false, failWithError: true }),
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
