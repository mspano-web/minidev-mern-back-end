/**
 * contact.mysql.ts
 */

import { IContact } from "../../types/contact.type";
import { GenericServicesMySQL } from "./generic.mysql";
import {format} from 'mysql2'

// -------------------------------------------------------------

/**
 * Class with access functions to the MySQL model, contacts table.
 */
export class ContactMySQL {

    /**
     * Function that performs the registration of a contact in the database.
     * 
     * @param contact Contact details to be registered.
     * @returns Return without information.
     */
    static async create(contact: IContact): Promise<void> {
      let gS = null
      let newId: number = 0

      gS = new GenericServicesMySQL<IContact>();
   
      const insertQuery = 'INSERT INTO CONTACTS (cont_name, cont_email, cont_comments) VALUES (?, ?, ?)';
      const query = format(insertQuery,[contact.cont_name, contact.cont_email, contact.cont_comments]) 
      await gS.create(query)
   
      return
    }

}

// -------------------------------------------------------------

