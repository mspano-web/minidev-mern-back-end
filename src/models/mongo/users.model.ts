/**
 * users.model.ts
 */

import { Schema, model, Model, Types } from "mongoose";
import { IUser } from "../../types/user.type";

// -----------------------------------------------------------

// Creation of a schema corresponding to the document interface. ----------
//    The Schema allows you to define the fields stored in each document along
//    with their validation requirements and default values.

const UsersSchema = new Schema(
  {
    _id: { type: String, default: Types.ObjectId(), required: true },
    usr_name: { type: String, required: true },
    usr_email: { type: String, required: true, unique: true },
    usr_street_address: { type: String, required: true },
    state_id: { type: String, required: true },
    city_id: { type: String, required: true },
    usr_zip: { type: String, required: true },
    usr_phone_number: { type: String, required: true },
    usr_username: { type: String, required: true, unique: true },
    usr_password: { type: String, required: true },
    rol_id: { type: String, required: true },
  },
  { timestamps: true } // Example. Audit information aggregate. It is not in the design.
);

// Create a Model -------------------------------------------------------
// Models are defined using the Schema interface.
// Schemas are then "compiled" into models using the mongoose.model() method.
// Once you have a model you can use it to find, create, update, and
//   delete objects of the given type.
export const UserModel: Model<IUser> = model<IUser>("Users", UsersSchema);

// -----------------------------------------------------------
