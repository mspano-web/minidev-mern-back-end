/**
 *  sales.model.ts
 */

import { Schema, model, Model, Types } from "mongoose";
import { ISale } from "../../types/sale.type"

// -----------------------------------------------------------

const SalesSchema = new Schema({
    _id:  { type: Schema.Types.ObjectId,  auto: true }, 
    pub_id: { type: String, required: true},
    usr_id: { type: String, required: true},
    sale_delivery_date: { type: Date, required: true},
    sale_purchase_date: { type: Date, required: true, default: Date.now},
    sale_invoice_amount: { type: Number, required: true}
});

// -----------------------------------------------------------

export const SaleModel: Model<ISale> =  model<ISale>("Sales", SalesSchema);

// -----------------------------------------------------------
