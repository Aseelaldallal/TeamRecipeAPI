import { Request } from 'express';
import { User, IUserModel } from '../../models/user';
import {
	Strategy as LocalStrategy,
	IVerifyOptions,
	IStrategyOptionsWithRequest
} from 'passport-local';
import { customError } from '../../shared/Error';

type IDone = (error: any, user?: any, options?: IVerifyOptions) => void;

// ===============================================
// Local Register
// ===============================================

// By default, local strategy uses username and password, we will override with email
const registerOptions: IStrategyOptionsWithRequest = {
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
};

async function register(
	req: Request,
	email: string,
	password: string,
	done: IDone
) {
	email = email ? email.toLocaleLowerCase() : null;
	try {
		const user = await User.findOne({ email });
		if (user) {
			throw new customError(
				'UserExists',
				`The email ${email} is already registered`,
				209
			);
		}
		const newUser = await createAndSaveUser(req);
		return done(null, newUser);
	} catch (err) {
		return done(err);
	}
}

async function createAndSaveUser(req: Request): Promise<IUserModel> {
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

export const localRegister = new LocalStrategy(registerOptions, register);

// ===============================================
// Local Login
// ===============================================

const loginOptions = { usernameField: 'email', passwordField: 'password' };

async function login(email: string, password: string, done: IDone) {
	if (email) {
		email = email.toLowerCase();
	}
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return done(null, false, { message: 'Incorrect username' });
		}
		if (!user.validPassword(password)) {
			return done(null, false, { message: 'Incorrect password' });
		}
	} catch (err) {
		return done(err);
	}
}

export const localLogin = new LocalStrategy(loginOptions, login);
