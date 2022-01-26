/**
 * categories.model.ts
 */

import { Schema, model, Model } from "mongoose";
import { ICategory } from "../../types/category.type";

// -----------------------------------------------------------

const CategoriesSchema: Schema = new Schema({
  _id: { type: String, required: true },
  cat_flag_single: { type: Boolean, required: true },
  cat_description: { type: String, required: true },
});

export const CategoryModel: Model<ICategory> = model<ICategory>(
  "Categories",
  CategoriesSchema
);

// -----------------------------------------------------------
