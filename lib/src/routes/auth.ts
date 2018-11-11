// ===============================================
// SETUP
// ===============================================

// const passport = require('../config/passport'); // index.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const router = express.Router();
// const middleware = require('../middleware');

import { Router, Request, Response } from 'express';
import { passport } from '../config/passport';
import { secretOrKey } from '../config/passport/jwtStrategy';
import * as jwt from 'jsonwebtoken';
import { User, IUserModel } from '../models/user';

export const router = Router();

// ===============================================
// Register
// ===============================================

router.post(
	'/register',
	passport.authenticate('local-register'),
	(req: Request, res: Response) => {
		const user = req.user;
		const token = jwt.sign({ id: user.id }, secretOrKey, {
			expiresIn: '1h'
		});
		const expiry = 3600; // 1hr
		res.status(200).json({
			token,
			expiry
		});
	}
);

// ===============================================
// Login
// ===============================================

// router.post('/login', login);

// async function login(req: Request, res: Response): Promise<void> {
// 	const email = req.body.email.toLowerCase();
// 	const user = await User.findOne({ email });
// 	if (!user) {
// 		const error = new Error(`No user with email ${email} exists`);
// 		error.name = 'UserNotRegistered';
// 		throw error;
// 	}
// 	if (user.validPassword(req.body.password)) {
// 		// let token = jwt.sign({ id: foundUser._id }, jwt_secretOrKey, {
// 		//             expiresIn: '1h'
// 		//           });
// 		//           let expiry = 3600; // expiry
// 	}
// }

// router.post(
//   '/login',
//   middleware.sanitizeUserInput,
//   middleware.validateRegisterationForm,
//   (req, res) => {
//     console.log('IM HERE');
//     User.findOne({ 'jwt.email': req.body.email.toLowerCase() })
//       .then(foundUser => {
//         if (!foundUser) {
//           res
//             .status(401)
//             .json({ messages: [`${req.body.email} is not registered`] });
//         } else if (foundUser.validPassword(req.body.password)) {
//           let token = jwt.sign({ id: foundUser._id }, jwt_secretOrKey, {
//             expiresIn: '1h'
//           });
//           let expiry = 3600; // expiry
//           res
//             .status(200)
//             .json({ id: foundUser._id, token: token, expiry: expiry, fullname: foundUser.fullname, bio: foundUser.bio, email: foundUser.jwt.email  });
//         } else {
//           res.status(401).json({ messages: ['Incorrect Password'] });
//         }
//       })
//       .catch(err => {
//         res.status(401).json({ messages: ['Woops, something went wrong'] });
//       });
//   }
// );

// ===============================================
// Logout
// ===============================================

// router.get('/logout', (req, res) => {
//     res.send('logout');
// });
