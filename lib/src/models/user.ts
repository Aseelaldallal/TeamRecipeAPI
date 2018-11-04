import { Document, Model, model, Schema, Types } from 'mongoose';

export interface IUserModel extends Document {
	createdAt: Date;
	updatedAt: Date;
	username: string;
	firstname: string;
	lastname: string;
	password: string;
	address: string;
	recipes: Array<{
		id: Types.ObjectId;
		name: string;
	}>;
}

export let UserSchema: Schema = new Schema(
	{
		username: String,
		firstname: String,
		lastname: String,
		password: String,
		address: String,
		recipes: [
			{
				id: {
					type: Schema.Types.ObjectId,
					ref: 'Recipe'
				}
			}
		]
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
