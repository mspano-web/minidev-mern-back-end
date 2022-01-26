/**
 * publications.model.ts
 */

import { Schema, model, Model, Types } from "mongoose";
import { IPublication } from "../../types/publication.type"

// -----------------------------------------------------------

const PublicationsSchema = new Schema({

    _id:{ type: Schema.Types.ObjectId,  auto: true },
    pub_title: { type: String, required: true, trim:true},
    pub_description: { type: String, required: true},

    category: 
    {
        _id: { type: String, required: true },
        cat_flag_single:  { type: Boolean, required: true },
        cat_description:  { type: String, required: true },
    },

    pub_price: { type: Number, required: true},
    pub_shipping_cost: { type: Number },
    pub_create_date: { type: Date, required: true, default: Date.now },
    pub_due_date: { type: Date },

    products: [
        {
            _id: { type: String, required: true },
            prod_title: { type: String, required: true, trim:true },
            prod_description: { type: String, required: true },
            prod_price: { type: Number },
            category: 
            {
                _id: { type: String, required: true },
                cat_flag_single:  { type: Boolean, required: true },
                cat_description:  { type: String, required: true },
            },
            images: [
                {
                 img_flag_main: { type: Boolean, required: true },
                 img_filename: { type: String, required: true },
                 img_extension: { type: String }
                }
             ],
           
        }
    ]
} 
);

export const PublicationModel: Model<IPublication> =  model<IPublication>("Publications", PublicationsSchema);

// -----------------------------------------------------------
