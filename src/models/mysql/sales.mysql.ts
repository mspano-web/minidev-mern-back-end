/**
 * sales.mysql.ts
 */

import { GenericServicesMySQL } from "./generic.mysql";
import { ISale } from "../../types/sale.type"
import {format} from 'mysql2'
const { InternalError } = require('../../errors/errors');

/**
 * Class with access functions to the MySQL model, sales table.
 */
export class SalesMySQL {

        /**
         * Function that performs the registration of a sale.
         * 
         * @param s         Sale data.
         * @returns         Returns the new ID of the sale created.
         */
        static async create(s: ISale): Promise<number> {
            let newId: number = 0
            if (!s) throw new InternalError({message: "Create Sale Fail", data: {sale: s}})
            let gS = new GenericServicesMySQL<ISale>();
            let insertQuery = 'INSERT INTO sales (pub_id, usr_id, sale_delivery_date, sale_invoice_amount) VALUES (?, ?, ?, ?)';
            let query = format(insertQuery,[s.pub_id, s.usr_id, s.sale_delivery_date, s.sale_invoice_amount]) 
            newId = await gS.create(query) // Wait for the Promise to be resolved

            return newId;  // Transform to the return type Promise <number>
        }
}

// ----------------------------------------------------------------------
