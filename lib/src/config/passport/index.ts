import * as Passport from 'passport';
import { User, IUserDocument } from '../../models/user';
import { JWTStrategy } from './jwtstrategy';
import { localLogin, localRegister } from './localStrategy';

function setupStrategies(passportToConfigure: Passport.PassportStatic) {
	passportToConfigure.serializeUser((user: IUserDocument, done) => {
		done(null, { _id: user._id });
	});

	passportToConfigure.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	});

	passportToConfigure.use('jwt', JWTStrategy);
	passportToConfigure.use('local-register', localRegister);
	passportToConfigure.use('local-login', localLogin);
	return passportToConfigure;
}

export const passport = setupStrategies(Passport);
