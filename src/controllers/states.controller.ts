/**
 * states.controller.ts
 */

import { Request, Response, NextFunction } from "express";
const StatesService = require("../services/states.services");
const { StandardError } = require('../errors/errors');

/**
 * Controlling function, processes a request to obtain the associated states and cities, 
 *   invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getStates = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const states = await StatesService.getStates();
    return res.status(200).json(states);
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controlling function, processes a request to obtain a particular state and associated cities, 
 *     invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getState = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const state = await StatesService.getState(req.params.id);
    if (!state) throw new StandardError({message: "Get State without data", data: {state_id: state}})
    return res.status(200).json({ data: state });
  } catch (e: any) {
    next(e)
  }
};

// --------------------------------------------------------------------
