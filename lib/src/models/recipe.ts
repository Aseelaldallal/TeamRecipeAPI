import { Document, Model, model, Schema, Types } from 'mongoose';
import { IIngredient, IRecipe } from '../interfaces/recipe';

export interface IIngredientModel extends IIngredient, Document {}

const IngredientSchema: Schema = new Schema({
	name: { type: String, required: true },
	amount: {
		type: Number,
		required: true,
		validate: {
			validator(v) {
				return v > 0;
			},
			message: 'Amount must be greater than 0'
		}
	},
	unit: { type: String },
	calories: { type: Number }
});

export interface IRecipeModel extends IRecipe, Document {
	createdAt: Date;
	updatedAt: Date;
}

const RecipeSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		author: {
			id: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			username: { type: String, required: true }
		},
		ingredients: {
			type: [IngredientSchema],
			required: true
		},
		image: { type: String, required: true },
		rating: { type: Number }
	},
	{ timestamps: true }
);

export const Recipe: Model<IRecipeModel> = model<IRecipeModel>(
	'Recipe',
	RecipeSchema
);
