import { Document, Model, model, Schema } from 'mongoose';

export interface IUserModel extends Document {
	createdAt: Date;
}

export let UserSchema: Schema = new Schema(
	{
		address: String,
		name: String,
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
