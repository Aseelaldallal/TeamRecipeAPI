import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user';
import { Recipe } from './recipe';

export interface IUserModel extends IUser, Document {
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema: Schema = new Schema(
	{
		username: { type: String, required: true },
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		password: { type: String, required: true },
		address: { type: String, required: true }
	},
	{ timestamps: true }
);

UserSchema.post('remove', async function(this: IUserModel) {
	console.log('Removing User');
	// ADD : Remove All User Recipes from Recipe Model
	// await Recipe.remove({ author: { id: this._id } });
});

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

// UserSchema.pre('save', function(next) {
// 	const user = this as IUserModel;
// 	const now = new Date();
// 	if (!user.createdAt) {
// 		user.createdAt = now;
// 	}
// 	next();
// });
