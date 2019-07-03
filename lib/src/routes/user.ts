/* ------------------------------------- */
/* -----------------SETUP--------------- */
/* ------------------------------------- */

import * as express from 'express';
import 'express-async-errors';
import { passport } from '../config/passport';
import { User } from '../models/user';
import { CustomError } from '../shared/Error';

export const router = express.Router();

/* ------------------------------------- */
/* --------------INDEX ROUTE------------ */
/* ------------------------------------- */

router.get('/', async (req: express.Request, res: express.Response) => {
	const users = await User.find();
	res.json(users);
});

/* ------------------------------------- */
/* ---------------SHOW ROUTE------------ */
/* ------------------------------------- */

router.get('/:id', async (req: express.Request, res: express.Response) => {
	const user = await User.findById(req.params.id);
	res.json(user);
});

/* ------------------------------------- */
/* --------------UPDATE ROUTE----------- */
/* ------------------------------------- */

router.patch(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req: express.Request, res: express.Response) => {
		if (req.body.email) {
			throw new CustomError('BadRequest', 'Cannot change user email address', 401);
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		});
		res.json(updatedUser);
	}
);

/* ------------------------------------- */
/* -------------DESTROY ROUTE----------- */
/* ------------------------------------- */

router.delete('/:id', async (req: express.Request, res: express.Response) => {
	const userToDelete = await User.findById(req.params.id);
	await userToDelete.remove();
	res.json({});
});
