import { Document, Model, model, Schema, Types } from 'mongoose';

export interface IUserModel extends Document {
	createdAt: Date;
	updatedAt: Date;
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

const UserSchema: Schema = new Schema(
	{
		username: { type: String, required: true },
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		password: { type: String, required: true },
		address: { type: String, required: true },
		teams: [
			{
				id: {
					type: Schema.Types.ObjectId,
					ref: 'Team'
				}
			}
		],
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
