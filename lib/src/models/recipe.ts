import { Document, Model, model, Schema, Types } from 'mongoose';

export interface IIngredientModel extends Document {
	name: string;
	amount: number;
	unit: string;
	calories: number;
}

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
	rating: number;
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
