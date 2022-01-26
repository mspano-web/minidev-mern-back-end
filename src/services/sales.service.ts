/**
 * sales.service.ts
 */

import { SaleModel } from "../models/mongo/sales.model";
import { ISale } from "../types/sale.type"
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { SalesMySQL } from "../models/mysql/sales.mysql"
const { StandardError, InternalError } = require('../errors/errors');

/**
 * Service function, processes the business case of registering a sale. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param sale  Information of the sale to be registered.
 * @returns ID of the registered sale.
 */
export const createSale = async function (sale: ISale): Promise<number> {
    let newId : number = 0
    try {
      if(!sale) throw new InternalError({message: "Create Sale Fail", data: {sale: sale}})
      if ( Configuration.getInstance().iDatabase.type === MONGO) {
        newId = (await SaleModel.create(sale))._id
      } else {
         newId = await SalesMySQL.create(sale)
      }

    } catch (e) {
      if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
      else {  throw new InternalError({message: "Create Sale Fail", data: {sale: sale}, exception: e}) }      
      }
    return (newId)
  };

// -----------------------------------------------------------
