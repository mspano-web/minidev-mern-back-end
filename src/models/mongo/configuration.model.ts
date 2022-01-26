/**
 * configuration.model.ts
 */

import { Schema, model, Model } from "mongoose";
import { IConfiguration } from "../../types/configuration.type";

// -----------------------------------------------------------

const ConfigurationSchema: Schema = new Schema({
  conf_delivery_time_from: { type: Number, required: true },
  conf_delivery_time_to: { type: Number, required: true },
  conf_path_image_prod: { type: String, required: true },
  conf_name_image_prod_default: { type: String, required: true },
});

export const ConfigurationModel: Model<IConfiguration> = model<IConfiguration>(
  "Configuration",
  ConfigurationSchema
);

// -----------------------------------------------------------
