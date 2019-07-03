import { Document, Model, model, Schema, HookNextFunction } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

export interface IUserModel extends Document {
	createdAt: Date;
	updatedAt: Date;
	email: string;
	password: string;
	username: string;
	firstname: string;
	lastname: string;
	address: string;
	generateHash: (password: string) => string;
	validPassword: (password: string) => boolean;
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

UserSchema.methods.validPassword = function(password: string) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function(this: IUserModel, next: HookNextFunction) {
	this.email = this.email.toLowerCase();
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
	next();
});

UserSchema.post('remove', async function(this: IUserModel) {
	// 	console.log('Removing User');
	//     — Removing teams that have user as admin
	// — Removing recipes are created by user
	// Remove user from teams
});

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
