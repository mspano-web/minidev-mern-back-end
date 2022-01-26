/**
 * categories.mysql.ts
 */

import { ICategory } from "../../types/category.type";
import { categoriesFindFilters } from "../../types/search.types";
import { GenericServicesMySQL } from "./generic.mysql";
const { InternalError, StandardError } = require('../../errors/errors');


// -------------------------------------------------------------

/**
 * Class with access functions to the MySQL model, categories table.
 */
  export class CategoriesMySQL {


    // ----------------------------------------

    /**
     * Recovery of all categories registered in the application.
     * 
     * @returns Categories found.
     */
    static async find(): Promise<Array<ICategory>>  {
        let gS = new GenericServicesMySQL<ICategory>();
        let results: Array<ICategory> = await gS.find(
            "SELECT _id, cat_flag_single, cat_description FROM categories ORDER BY cat_description"
        );
        return results;
    }

    /**
    * Function that performs the recovery of a particular category, registered in the application
    * 
    * @param clv          Field to be used as a key in the "query" that performs the user search.
    * @param valueSearch  Value to search (example: ID)
    * @returns            Returns the user's data. 
    */
     static async findOne(clv: categoriesFindFilters, valueSearch: string): Promise<ICategory> {
        if (!valueSearch || !clv)
          throw new InternalError({message: "Get Category Fail", data: {valueSearch: valueSearch, clv: clv }})
        let gS = new GenericServicesMySQL<ICategory>();
        const query = `SELECT _id, cat_flag_single, cat_description FROM categories WHERE ${clv} = ?`
        let result: ICategory = await gS.findOne(query, valueSearch)

        return result;
    }
 

}

   
// -------------------------------------------------------------
