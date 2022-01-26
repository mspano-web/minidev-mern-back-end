/**
 * products.services.ts
 */

import { ProductModel } from "../models/mongo/products.model";
import { IProduct } from "../types/product.type";
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { joinProductsToObject, joinProductToObject } from "../helpers/joinMySQLtoObject";
import { ProductsMySQL } from "../models/mysql/products.mysql";
import { productFindFilters } from "../types/search.types";
const { StandardError, InternalError } = require('../errors/errors');

/**
 * Service function, processes the business case of request to obtain all the products registered in the application. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * @returns Returns the products registered in the system.
 */
export const getProducts = async function (): Promise<Array<IProduct>> {
  let products: Array<IProduct>;

  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      products = await ProductModel.find({}, { createdAt: 0, updatedAt: 0 }).sort({_id: 'asc'});
    } else {
      const productsJoin = await ProductsMySQL.find();
      products = joinProductsToObject(productsJoin);
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Products Fail", data: {}, exception: e}) }    
}

  return products;
};

/**
 * Service function, processes the business case of request to obtain a certain product. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param product_id Product ID to search.
 * @returns Returns the data of the searched product.
 */
export const getProduct = async function (
  product_id: string
): Promise<IProduct | null> {
  let product: IProduct | null;
  try {
    if(!product_id) throw new InternalError({message: "Get Product Fail", data: {product_id: product_id}})
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      product = await ProductModel.findOne({ _id: product_id });
    } else {
      const productsJoin = await ProductsMySQL.findSome(
        productFindFilters.ProductId,
        product_id
      );
      product = joinProductToObject(productsJoin);
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Product Fail", data: {}, exception: e}) }    
  }
  return product;
};

// ------------------------------------------------------------
