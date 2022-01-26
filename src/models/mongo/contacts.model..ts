/**
 * contacts.model.ts
 */

import { Schema, model, Model, Document } from "mongoose";
import { IContact } from "../../types/contact.type";

// -----------------------------------------------------------

const ContactSchema = new Schema({
  cont_name: { type: String, required: true },
  cont_email: { type: String, required: true },
  cont_comments: { type: String, required: true },
  cont_date: { type: Date, required: true, default: Date.now },
});

export const ContactModel: Model<IContact> = model<IContact>(
  "Contact",
  ContactSchema
);

// -----------------------------------------------------------
