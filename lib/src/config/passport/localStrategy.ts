import { Request } from 'express';
import { User, IUserModel } from '../../models/user';
import {
	Strategy as LocalStrategy,
	IVerifyOptions,
	IStrategyOptionsWithRequest,
	IStrategyOptions
} from 'passport-local';
import { CustomError } from '../../shared/Error';

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
			const msg = `The email ${email} is already registered`;
			throw new CustomError('UserExists', msg, 209);
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

const loginOptions: IStrategyOptions = {
	usernameField: 'email',
	passwordField: 'password'
};

async function login(email: string, password: string, done: IDone) {
	if (email) {
		email = email.toLowerCase();
	}
	try {
		const user = await User.findOne({ email });
		if (!user) {
			const msg = `${email} is not registered`;
			throw new CustomError('InvalidCredentials', msg, 401);
		}
		if (!user.validPassword(password)) {
			const msg = `Invalid Password`;
			throw new CustomError('InvalidCredentials', msg, 401);
		}
		return done(null, user);
	} catch (err) {
		return done(err);
	}
}

export const localLogin = new LocalStrategy(loginOptions, login);
