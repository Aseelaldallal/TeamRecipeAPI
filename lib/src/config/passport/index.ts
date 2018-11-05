import { PassportStatic } from 'passport';
import { User, IUserModel } from '../../models/user';
import { JWTStrategy } from './jwtstrategy';

export function setupStrategies(passport: PassportStatic) {
	passport.serializeUser((user: IUserModel, done) => {
		done(null, { _id: user._id });
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user: IUserModel) => {
			done(err, user);
		});
	});

	passport.use('jwt', JWTStrategy);
}
