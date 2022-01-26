/**
 * categories.controller.ts
 */
import { Request, Response, NextFunction } from "express";
import {ICategory} from "../types/category.type"
const CategoriesService = require("../services/categories.services");
const { StandardError } = require('../errors/errors');

/**
 * Controlling function, receives a request to obtain categories, requests its resolution from the corresponding service and formats and returns the response with the requested information
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */

export const getCategories = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const categories: ICategory = await CategoriesService.getCategories();
    return res.status(200).json(categories);
  } catch (e: any) {
    next(e)
  }
};

// --------------------------------------------------------------------


/**
 * Controller function, processes a request to obtain a particular category, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const getCategory = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const cat_id: string = req.params.id;
    if (!cat_id) throw new StandardError({message: "Get Category without data", data: {cat_id: cat_id}})
    const category: ICategory = await CategoriesService.getCategory(cat_id); 
    return res.status(200).json( category );
  } catch (e: any) {
    next(e)
  }
};
