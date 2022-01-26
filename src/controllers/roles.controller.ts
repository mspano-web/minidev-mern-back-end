/**
 * roles.controller.ts
 */

 import { Request, Response, NextFunction } from "express";
 import { IRol } from "../types/role.type"
 const RolesService = require("../services/roles.services");
 const { StandardError } = require('../errors/errors');
 
 /**
  * Controller function, processes a request to obtain the data of standard role, 
  *     invoking the corresponding service and returning the result of the processing.
  *  
  * @param req   Request
  * @param res   Response
  * @param next  Next middleware
  * @returns     Goes to the next middleware
  */
 export const getRolStandard = async function (req: Request, res: Response, next: NextFunction) {
   try {
     const rol: IRol = await RolesService.getRolStandard();
     return res.status(200).json(rol);
   } catch (e: any) {
     next(e)
   }
 };