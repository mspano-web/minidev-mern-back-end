/**
 * roles.model.ts
 */

import { Schema, model, Model } from "mongoose";
import { IRol } from "../../types/role.type";

// -----------------------------------------------------------

const RolesSchema = new Schema({
  _id: { type: String, required: true },
  rol_name: { type: String, default: "STANDARD", enum: ["STANDARD", "ADMIN"], required: true,},
});

export const RolesModel: Model<IRol> = model<IRol>("Roles", RolesSchema);

// -----------------------------------------------------------
