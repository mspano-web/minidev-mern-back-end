/**
 * products.mysql.ts
 */

import { IProductCategoryImage }  from "../../types/product-category-image.type"
import { GenericServicesMySQL } from "./generic.mysql";
import { productFindFilters } from "../../types/search.types"
const { InternalError } = require('../../errors/errors');

/**
 * Class with access functions to the MySQL model, products table.
 */
export class ProductsMySQL {

/**
 * Function that performs the recovery of all the products registered in the application.
 *    For each product it also obtains the data of the category and associated images.
 *  
 * @returns   Returns the products found, with the categories and associated images.
 */
  static async find(): Promise<Array<IProductCategoryImage>> {
      let gS = new GenericServicesMySQL<IProductCategoryImage>();

      // Outer join
      let results: Array<IProductCategoryImage> = await gS.find(
        "SELECT p._id, c._id as cat_id, i._id as image_id, prod_title, prod_description, prod_price, cat_flag_single, cat_description, img_flag_main, img_filename, img_extension FROM products as p LEFT JOIN categories AS c ON c._id = p.cat_id LEFT JOIN images as i ON i.prod_id = p._id order by prod_title;"
      );
      return results;
  }

  /**
   * Function that performs the recovery of a specific product.
   * 
   * @param clv           Field to be used as a key in the "query" that performs the product search.
   * @param valueSearch   Product identification code.
   * @returns             Returns the product data, with the information of its category and associated images.
   */
  static async findSome(clv: productFindFilters, valueSearch: string): Promise<Array<IProductCategoryImage>> {
      let gS = new GenericServicesMySQL<IProductCategoryImage>();

      if (!valueSearch || !clv) throw new InternalError({message: "Get Products Fail", data: {valueSearch: valueSearch, clv: clv }})
      // Outer join
      //const query = `SELECT _id, usr_name, usr_email, usr_street_address, state_id, usr_zip, usr_phone_number, usr_username, usr_password,rol_id FROM users WHERE ${clv} = ?`
      const query = `SELECT p._id, c._id as cat_id, i._id as image_id, prod_title, prod_description, prod_price, cat_flag_single, cat_description, img_flag_main, img_filename, img_extension FROM products as p LEFT JOIN categories AS c ON c._id = p.cat_id LEFT JOIN images as i ON i.prod_id = p._id WHERE ${clv} = ? order by prod_title;`
      let results: Array<IProductCategoryImage> = await gS.findSome(query, valueSearch)

      return results;
  }

 }

 // ------------------------------------------------------------------------------