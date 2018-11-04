import { Document, Model, model, Schema, Types } from 'mongoose';

export interface ITeamModel extends Document {
	createdAt: Date;
	updatedAt: Date;
	name: string;
	members: Array<{
		id: Types.ObjectId;
		username: string;
	}>;
	recipes: Array<{
		id: Types.ObjectId;
		name: string;
	}>;
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

export const Team: Model<ITeamModel> = model<ITeamModel>('Team', TeamSchema);
