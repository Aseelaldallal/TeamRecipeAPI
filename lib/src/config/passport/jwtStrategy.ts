import { User } from '../../models/user';
import { Strategy, ExtractJwt } from 'passport-jwt';

export const secretOrKey = 'blooper';

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey
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
