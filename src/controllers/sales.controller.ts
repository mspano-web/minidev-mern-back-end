/**
 * sales.controller.ts
 */

import { Request, Response, NextFunction } from "express";
const SalesService = require("../services/sales.service");
const { StandardError } = require('../errors/errors');

/**
 * Controlling function, processes a request to register a sale, 
 *   invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const createSale = async function ( req: Request, res: Response, next: NextFunction) {
  try {
    const sale = req.body;
    if (!sale) throw new StandardError({message: "Create Publication without data", data: {sale: sale}})
    return res.status(200).json(await SalesService.createSale(sale));
  } catch (e: any) {
    next(e)
  }
};

// ------------------------------------------------------------
