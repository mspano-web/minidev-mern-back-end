/**
 * tokens.model.ts
 */

import { Schema, model, Model, Types } from "mongoose";
import {IToken} from "../../types/token.type"

// -----------------------------------------------------------

const TokensSchema = new Schema(
    {
      usr_id: { type: String,  required: true},
      tok_generated: { type: String, unique: true, required: true},
      tok_expiration: { type: Date, default: Date.now, expires: 60 * 10 * 1000}
    }
  );
  
  // Create a Model -------------------------------------------------------
  // Models are defined using the Schema interface.
  // Schemas are then "compiled" into models using the mongoose.model() method.
  // Once you have a model you can use it to find, create, update, and
  //   delete objects of the given type.
  export const TokenModel: Model<IToken> = model<IToken>("Tokens", TokensSchema);

  // -----------------------------------------------------------
