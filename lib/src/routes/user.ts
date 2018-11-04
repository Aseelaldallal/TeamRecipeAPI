/* ------------------------------------- */
/* -----------------SETUP--------------- */
/* ------------------------------------- */

import * as express from 'express';
import 'express-async-errors';
import { IUser } from '../interfaces/user';
import { User } from '../models/user';

export const router = express.Router();

/* ------------------------------------- */
/* --------------INDEX ROUTE------------ */
/* ------------------------------------- */

router.get('/', async (req: express.Request, res: express.Response) => {
	const users = await User.find();
	res.json(users);
});

/* ------------------------------------- */
/* -------------CREATE ROUTE------------ */
/* ------------------------------------- */

router.post('/new', async (req: express.Request, res: express.Response) => {
	const user: IUser = {
		username: req.body.username,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		password: req.body.password,
		address: req.body.address
	};
	const newUser = await User.create(user);
	res.json(newUser);
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

router.put('/:id', async (req: express.Request, res: express.Response) => {
	const user: IUser = {
		username: req.body.username,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		password: req.body.password,
		address: req.body.address
	};
	const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {
		new: true
	});
	res.json(updatedUser);
});

/* ------------------------------------- */
/* -------------DESTROY ROUTE----------- */
/* ------------------------------------- */

router.delete('/:id', async (req: express.Request, res: express.Response) => {
	const userToDelete = await User.findById(req.params.id);
	await userToDelete.remove();
	res.json({});
});
