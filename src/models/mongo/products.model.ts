/**
 * products.model.ts
 */

import { Schema, model, Model, Types } from "mongoose";
import { IProduct } from "../../types/product.type";

// -----------------------------------------------------------

const ProductSchema = new Schema({
  _id: { type: String, required: true },
  prod_title: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  prod_description: { type: String, required: true },
  prod_price: { type: Number, min: 0 },
  category: new Schema({
    _id: { type: String, required: true },
    cat_flag_single: { type: Boolean, required: true },
    cat_description: { type: String, required: true },
  }),
  images: Array,
});

export const ProductModel: Model<IProduct> = model<IProduct>(
  "Product",
  ProductSchema
);

// -----------------------------------------------------------
