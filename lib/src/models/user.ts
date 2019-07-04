import { Document, Model, model, Schema, HookNextFunction } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import * as faker from 'faker';

export interface IUser {
	email: string;
	password: string;
	username: string;
	firstname: string;
	lastname: string;
	address: string;
}

export interface IUserDocument extends Document, IUser {
	createdAt: Date;
	updatedAt: Date;
	generateHash: (password: string) => string;
	validPassword: (password: string) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
	createDummy: () => IUser;
}

const UserSchema: Schema = new Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true },
		username: { type: String, required: true },
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		address: { type: String, required: true }
	},
	{ timestamps: true }
);

UserSchema.statics.createDummy = function() {
	return {
		email: faker.internet.email(),
		password: 'password',
		username: faker.internet.userName(),
		firstname: faker.name.firstName(),
		lastname: faker.name.lastName(),
		address: faker.address.streetAddress()
	};
};

UserSchema.methods.validPassword = function(password: string) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function(this: IUserDocument, next: HookNextFunction) {
	this.email = this.email.toLowerCase();
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
	next();
});

UserSchema.post('remove', async function(this: IUserDocument) {
	// 	console.log('Removing User');
	//     — Removing teams that have user as admin
	// — Removing recipes are created by user
	// Remove user from teams
});

export const User: IUserModel = model<IUserDocument, IUserModel>('User', UserSchema);
