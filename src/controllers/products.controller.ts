/**
 * products.controller.ts
 */

import { Request, Response, NextFunction } from "express";
const ProductService = require("../services/products.service");
const { StandardError } = require('../errors/errors');

/**
 * Controller function, processes a request to obtain the information of a certain product by invoking
 *     the corresponding service and returns the response with the requested information.
 *  
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getProduct = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const product_id = req.params.id
    if (!product_id) throw new StandardError({message: "Get Product without data", data: {product_id: product_id}})
    const product = await ProductService.getProduct(product_id);
    return res.status(200).json(product);
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controller function, processes a request to obtain the information of all the existing products 
 *   by invoking the corresponding service and returns the response with the requested information.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getProducts = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const products = await ProductService.getProducts();
    return res.status(200).json(products);
  } catch (e: any) {
    next(e)
  }
};

// --------------------------------------------------------------------
