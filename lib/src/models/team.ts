import { Document, Model, model, Schema } from 'mongoose';

export interface ITeamModel extends Document {
	createdAt: Date;
	updatedAt: Date;
	name: string;
	members: string;
	recipes: string;
}

export let TeamSchema: Schema = new Schema(
	{
		name: String,
		members: [
			{
				id: {
					type: Schema.Types.ObjectId,
					ref: 'User'
				},
				username: String
			}
		],
		recipes: String
	},
	{ timestamps: true }
);

export const User: Model<ITeamModel> = model<ITeamModel>('Team', TeamSchema);
