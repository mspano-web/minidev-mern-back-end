/**
 * configuration.controller.ts
 */

import { Request, Response, NextFunction } from "express";
const ConfigurationService = require("../services/configuration.services");

/**
 * Controlling function, receives a request to obtain the app configuration, requests its resolution from the corresponding service and formats and returns the response with the requested information
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */

export const getConfiguration = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const configuration = await ConfigurationService.getConfiguration();
    return res.status(200).json( configuration );
  } catch (e: any) {
    next(e)
  }
};

// --------------------------------------------------------------------
