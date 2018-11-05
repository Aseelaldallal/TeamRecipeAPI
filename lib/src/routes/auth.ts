// ===============================================
// SETUP
// ===============================================

// const passport = require('../config/passport'); // index.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const router = express.Router();
// const middleware = require('../middleware');

import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { User, IUserModel } from '../models/user';

const jwtSecretOrKey = 'blooper';

export const router = express.Router();

router.post('/register', register);

async function register(req: express.Request, res: express.Response) {
	const user = await User.findOne({ email: req.body.email.toLowerCase() });
	if (user) { throw new Error('userExists'); }

	const newUser = await createAndSaveUser(req);
	const token = jwt.sign({ id: newUser._id }, jwtSecretOrKey, {
		expiresIn: '1h'
	});
	const expiry = 3600; // 1hr
	res.status(200).json({
		token,
		expiry,
		...newUser
	});
}

async function createAndSaveUser(req: express.Request): Promise<IUserModel> {
	const newUser = new User({
		email: req.body.email,
		password: req.body.password,
		username: req.body.username,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		address: req.body.address
	});
	return newUser.save();
}

// ===============================================
// Login
// ===============================================

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

// ===============================================
// Export
// ===============================================

module.exports = router;
