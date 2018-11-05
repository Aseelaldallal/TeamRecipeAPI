import { User } from '../../models/user';
import { Strategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'blooper'
};

export const JWTStrategy = new Strategy(
	jwtOptions,
	async (jwtPayload, next) => {
		try {
			const user = await User.findOne({ _id: jwtPayload.id });
			next(null, user);
		} catch (error) {
			throw new Error('JWT Strategy Error');
		}
	}
);
