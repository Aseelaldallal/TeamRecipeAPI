import { celebrate, Joi } from 'celebrate';
import * as express from 'express';
import { IUserDocument, User } from '../models/user';
import { ITeam, Team } from '../models/team';
import { CustomError, CustomError2 } from '../shared/Error';

/* --------------------------------------------------------- */
/* --------------------- ROUTE METHODS --------------------- */
/* --------------------------------------------------------- */

/**
 * Return All Teams
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getTeams = async (req: express.Request, res: express.Response) => {
	const teams = await Team.find();
	res.json({ teams });
};

/**
 * Return Single Team
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getTeam = async (req: express.Request, res: express.Response) => {
	const team = await Team.findById(req.params.id);
	res.json({ team });
};

/**
 * Create a team
 * @param {express.Request} req
 * @param {express.Response} res
 */
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

/**
 * Update Admin
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const updateAdmin = async (req: express.Request, res: express.Response) => {
	const { team } = res.locals;

	const newAdmin = await User.findById(req.body.newAdminId);
	if (!newAdmin) {
		throw new CustomError('BadRequest', `Cannot find user ${req.body.newAdminId}`, 403);
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
};

/* --------------------------------------------------------- */
/* ----------------------- VALIDATION ---------------------- */
/* --------------------------------------------------------- */

/**
 * Joi Validation
 * @param {string} methodName name of route method to validate
 * @returns
 */
export const validate = (methodName: string) => {
	let schema = {};
	switch (methodName) {
		case 'createTeam':
			schema = {
				body: Joi.object().keys({
					name: Joi.string().required()
				})
			};
			break;
		case 'updateAdmin':
			schema = {
				body: Joi.object().keys({
					newAdminId: Joi.string().required()
				}),
				params: Joi.object().keys({
					teamId: require('joi-objectid')(Joi)()
				})
			};
	}
	return celebrate(schema, { abortEarly: false });
};

/* --------------------------------------------------------- */
/* ----------------------- POPULATION ---------------------- */
/* --------------------------------------------------------- */

/**
 * Stores team teamId in res.locals
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
export const populateTeam = async (
	req: express.Request,
	res: express.Response,
	next: Function
) => {
	const team = await Team.findById(req.params.teamId);
	if (!team) {
		throw new CustomError2(
			'BadRequest',
			'InvalidParams',
			`Team ${req.params.teamId} does not exist`,
			400
		);
	}
	res.locals.team = team;
	next();
};

/* --------------------------------------------------------- */
/* -------------------------- OTHER ------------------------ */
/* --------------------------------------------------------- */

export const verifyAuthenticatedUserIsTeamAdmin = async (
	req: express.Request,
	res: express.Response,
	next: Function
) => {
	if (req.user.id !== res.locals.team.admin.id) {
		throw new CustomError2(
			'Forbidden',
			'AuthorizationError',
			'Only Team Admin can edit team',
			403
		);
	}
	next();
};

/* --------------------------------------------------------- */
/* ------------------------- HELPER ------------------------ */
/* --------------------------------------------------------- */
