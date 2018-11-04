import { Types } from 'mongoose';

export interface IUser {
	username: string;
	firstname: string;
	lastname: string;
	password: string;
	address: string;
	teams?: Array<{ id: Types.ObjectId }>;
	recipes?: Array<{
		id: Types.ObjectId;
		name: string;
	}>;
}
