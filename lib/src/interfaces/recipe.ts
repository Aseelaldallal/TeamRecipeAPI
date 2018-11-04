import { Types } from 'mongoose';

export interface IRecipe {
	name: string;
	author: {
		id: Types.ObjectId;
		username: string;
	};
	ingredients: IIngredient[];
	image: string;
	rating?: number;
}

export interface IIngredient {
	name: string;
	amount: number;
	unit?: string;
	calories?: number;
}
