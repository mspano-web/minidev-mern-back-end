/**
 *  roles.mysql.ts
 */

import { IRol } from "../../types/role.type";
import { GenericServicesMySQL } from "./generic.mysql";
import {rolFindFilters} from  "../../types/search.types"
const { InternalError } = require('../../errors/errors');


/**
 * Class with access functions to the MySQL model, roles table.
 */
export class RolesMySQL {

  /**
   * Function that performs the retrieval of a particular role that meets a search criteria.
   * 
   * @param clv           Field to be used as a key in the "query" that performs the rol search.
   * @param valueSearch   Value to search (example: rol name)
   * @returns             Returns the data of the role found.
   */
  static async findOne(clv: rolFindFilters, valueSearch: string): Promise<IRol> {
      let gS = new GenericServicesMySQL<IRol>();
      let  result: IRol 

      if (!valueSearch || !clv) throw new InternalError({message: "Get Rol Fail", data: {valueSearch: valueSearch, clv: clv }})
      const query = `SELECT _id, rol_name FROM roles WHERE ${clv} = ?`
      result = await gS.findOne(query, valueSearch)

      return result;
  }

  /**
   * Function that performs the retrieval of a particular role by its ID.
   * 
   * @param clv           Field to be used as a key in the "query" that performs the rol search.
   * @param valueSearch   Value to search (example: rol ID)
   * @returns             Returns the data of the role found.
   */
  static async findById(clv: rolFindFilters, valueSearch: string): Promise<IRol> {
      if (!valueSearch || !clv) throw new InternalError({message: "Get Rol Fail", data: {valueSearch: valueSearch, clv: clv }})
      let  result  = this.findOne(clv, valueSearch)
      return result;
  }
  
}

// -------------------------------------------------------------



