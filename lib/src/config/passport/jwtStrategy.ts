import { User } from '../../models/user';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CustomError } from '../../shared/Error';

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
			next(error);
		}
	}
);
