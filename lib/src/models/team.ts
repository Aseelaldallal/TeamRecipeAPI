import { Document, Model, model, Schema, Types } from 'mongoose';

export interface ITeam {
	name: string;
	admin: {
		id: Types.ObjectId;
		username: string;
	};
	members: Array<{
		id: Types.ObjectId;
		username: string;
	}>;
	recipes?: Array<{
		id: Types.ObjectId;
		name: string;
	}>;
}
export interface ITeamModel extends ITeam, Document {
	createdAt: Date;
	updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		admin: {
			id: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			username: { type: String, required: true }
		},
		members: [
			{
				id: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true
				},
				username: { type: String, required: true }
			}
		],
		recipes: [
			{
				id: {
					type: Schema.Types.ObjectId,
					ref: 'Recipe',
					required: true
				}
			}
		]
	},
	{ timestamps: true }
);

export const Team: Model<ITeamModel> = model<ITeamModel>('Team', TeamSchema);
