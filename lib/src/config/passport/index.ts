import { PassportStatic } from 'passport';
import { User, IUserModel } from '../../models/user';
import { JWTStrategy } from './jwtstrategy';

export function setupStrategies(passport: PassportStatic) {
	passport.serializeUser((user: IUserModel, done) => {
		done(null, { _id: user._id });
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	});

	passport.use('jwt', JWTStrategy);
}
