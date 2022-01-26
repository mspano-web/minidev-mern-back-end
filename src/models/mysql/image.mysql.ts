/**
 *  image.mysql.ts
 */

import { IImage } from "../../types/image.type";
import { GenericServicesMySQL } from "./generic.mysql";
import { imageFindFilters } from  "../../types/search.types"
import {format} from 'mysql2'
const { InternalError } = require('../../errors/errors');

/**
 * Class with access functions to the MySQL model, images table.
 */
export class ImageMySQL {

    /**
     * Function that performs the registration of an image associating it with a product in the database.
     * 
     * @param product_id  Product ID.
     * @param image       Image data.
     * @returns           Returns the new ID of the created image.
     */
    static async create(product_id: string, image: IImage): Promise<number> {
        let gS = null
        let newId: number = 0
          gS = new GenericServicesMySQL<IImage>();

          if(!product_id || !image) throw new InternalError({message: "Create Images Fail", data: {product_id: product_id, image: image }})
    
          const insertQuery = 'INSERT INTO images (prod_id, img_flag_main, img_filename, img_extension) VALUES (?, ?, ?, ?)';
          const query = format(insertQuery,[product_id, image.img_flag_main, image.img_filename, image.img_extension]) 
      
          newId = await gS.create(query)
    
        return newId;
      }
  
  /**
   * Function that removes an image associated with a certain product.
   * 
   * @param clv         Field to be used as a key in the "query" that removes the image.
   * @param valueSearch Identification of the image.
   * @returns           Returns true if the operation was successful and false otherwise.
   */
  static async deleteOne(clv: imageFindFilters, valueSearch: string): Promise<boolean | undefined> {
      let gS = new GenericServicesMySQL<IImage>();
      let  result: boolean = false

      if (!valueSearch || !clv) throw new InternalError({message: "Delete Images Fail", data: {valueSearch: valueSearch, clv: clv }})

      const query = `DELETE FROM images WHERE ${clv} = ?`
      result= await gS.deleteOne(query, valueSearch)

      return result;
  }

}

// -------------------------------------------------------------
