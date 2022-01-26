/**
 * contacts.services.ts
 */

import { IContact } from "../types/contact.type";
import { ContactModel } from "../models/mongo/contacts.model.";
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types";
import { ContactMySQL } from "../models/mysql/contact.mysql";
const { InternalError, StandardError } = require("../errors/errors");

/**
 * Service function, processes the business case of registering a contact in the application,
 *    based on the data provided.
 *    Depending on the database system in use, it invokes the corresponding model handler.
 *
 * @param contact Contact information to register.
 * @returns Return without information
 */
export const createContact = async function (contact: IContact): Promise<void> {
  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      await ContactModel.create(contact);
    } else {
      await ContactMySQL.create(contact);
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) {
      throw e;
    } else {
      throw new InternalError({
        message: "Create Contact Fail",
        data: {},
        exception: e,
      });
    }
  }
  // return;
};

// ------------------------------------------------------------
