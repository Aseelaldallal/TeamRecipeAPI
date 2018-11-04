import { Document, Model, model, Schema } from 'mongoose';

export interface IUserModel extends Document {
	createdAt: Date;
	updatedAt: Date;
	username: string;
	firstname: string;
	lastname: string;
	address: string;
	recipes: string;
}

export let UserSchema: Schema = new Schema(
	{
		username: String,
		firstname: String,
		lastname: String,
		address: String,
		recipes: String
	},
	{ timestamps: true }
);

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

// UserSchema.pre('save', function(next) {
// 	const user = this as IUserModel;
// 	const now = new Date();
// 	if (!user.createdAt) {
// 		user.createdAt = now;
// 	}
// 	next();
// });
