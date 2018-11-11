import { Document, Model, model, Schema, Types } from 'mongoose';
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

UserSchema.methods.generateHash = function(password: string) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.validPassword = function(password: string) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function(next) {
	(this as IUserModel).email = (this as IUserModel).email.toLowerCase();
	next();
});

UserSchema.post('remove', async function(this: IUserModel) {
	console.log('Removing User');
	// ADD : Remove All User Recipes from Recipe Model
	// await Recipe.remove({ author: { id: this._id } });
});

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
