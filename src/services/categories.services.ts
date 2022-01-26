/**
 * categories.services.ts
 */

import { CategoryModel } from "../models/mongo/categories.model";
import { ICategory } from "../types/category.type";
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { CategoriesMySQL } from "../models/mysql/categories.mysql";
import { categoriesFindFilters } from "../types/search.types";
const { InternalError, StandardError } = require('../errors/errors');

/**
 * Service function, processes the business case of request to obtain all the categories registered in the application. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * @returns Returns the categories registered in the system.
 */
export const getCategories = async function (): Promise<Array<ICategory>> {
  let categories: Array<ICategory>;

  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      categories = await CategoryModel.find()
    } else {
      categories = await CategoriesMySQL.find()
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Category Fail", data: {}, exception: e}); }
  }

  return categories;
};


/**
 * Service function, processes the business case of request to obtain the data of a particular category, 
 *    registered in the application. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param usr_id  User ID to search.
 * @returns Returns the user's data.
 */
 export const getCategory = async function (cat_id: string): Promise<ICategory | null> {
  let category: ICategory | null = null;

  try {
    if(!cat_id) throw new InternalError({message: "Get Ctaegory Fail", data: {cat_id: cat_id}})

    if (Configuration.getInstance().iDatabase.type === MONGO) {
      category = await CategoryModel.findOne({ _id: cat_id }, { _id: 0 })
    } else {
      category = await CategoriesMySQL.findOne(categoriesFindFilters.CategoryId, cat_id)
    }

  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Category Fail", data: {cat_id: cat_id}, exception: e}) }      
}
  return category;
};

// ------------------------------------------------------------


