import { Document, Model, model, Schema, Types } from 'mongoose';

export interface IRecipeModel extends Document {
	createdAt: Date;
	updatedAt: Date;
	name: string;
	author: {
		id: Types.ObjectId;
		username: string;
	};
	ingredients: IIngredientModel[];
	image: string;
	visibility: Array<{
		id: Types.ObjectId;
		username: string;
	}>;
	rating: number;
}

export interface IIngredientModel extends Document {
	name: string;
	amount: number;
	unit: string;
	calories: number;
}

export let RecipeSchema: Schema = new Schema(
	{
		name: String,
		author: {
			id: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			username: String
		},
		ingredients: [
			{
				name: String,
				amount: Number,
				unit: String,
				calories: Number
			}
		],
		image: String,
		visibility: [
			{
				id: {
					type: Schema.Types.ObjectId,
					ref: 'User'
				}
			}
		],
		rating: Number
	},
	{ timestamps: true }
);

export const Recipe: Model<IRecipeModel> = model<IRecipeModel>(
	'Recipe',
	RecipeSchema
);
