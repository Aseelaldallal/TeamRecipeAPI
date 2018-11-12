// ===============================================
// SETUP
// ===============================================

import { Router, Request, Response } from 'express';
import { passport } from '../config/passport';
import { secretOrKey } from '../config/passport/jwtStrategy';
import * as JWT from 'jsonwebtoken';
export const router = Router();

// ===============================================
// Register
// ===============================================

router.post('/register', passport.authenticate('local-register'), authenticate);
router.post('/login', passport.authenticate('local-login'), authenticate);

function authenticate(req: Request, res: Response) {
	const user = req.user;
	const token = JWT.sign({ id: user.id }, secretOrKey, {
		expiresIn: '1h'
	});
	const expiry = 3600; // 1hr
	res.status(200).json({
		token,
		expiry
	});
}
