/**
 * states.model.ts
 */

import { Schema, model, Model, Types } from "mongoose";
import { IState } from "../../types/state.types"

// -----------------------------------------------------------

const StatesSchema = new Schema({

    _id:  { type: String, default: Types.ObjectId(), required: true },
    state_description:  { type: String, required: true },

    cities: [
        {
            _id: { type: String, default: Types.ObjectId(), required: true },
            city_description: { type: String, required: true },
            city_delivery_days: { type:Number, required: true },
            city_shipping_cost:  { type: Number },
         }
    ] 
}
);

export const StateModel: Model<IState> =  model<IState>("States", StatesSchema);

// -----------------------------------------------------------
