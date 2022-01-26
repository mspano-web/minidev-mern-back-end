/**
 * security_controls.ts 
 */

const { roles }  = require("../helpers/accessControll")
import {Request, Response, NextFunction} from "express"
const { InternalError, StandardError } = require('../errors/errors');


/**
 * Function that allows to verify if a user has access to certain functionality in the system.
 * 
 * @param action    Action requested by the user in his request.
 * @param resource  System resource on which the user wants to perform an action.
 * @returns         Goto to the next middleware
 */
export const grantAccess = function(action: any, resource: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const permission = roles.can(res.locals.rol_name)[action](resource);  // res.locals.rol_name: Assigned in middleware
        if (!permission.granted) {
          throw new StandardError({message: "Access - enough permission", data: {rol: res.locals.rol_name, action: action, resource: resource }})
        }
        next()
      } catch (error) {
        if (!(error instanceof  StandardError && error instanceof InternalError)) { 
          error = new StandardError({message: "Access grant Fail", data: {rol: res.locals.rol_name, action: action, resource: resource }})
        }
        next(error)
      }
    }
  }
  
/**
 * Function that controls if the user has previously entered the system from the presence of the user's identification in the http messages.
 * 
 * @param req  Request
 * @param res  Response
 * @param next Next middleware
 */  
  export const allowIfLoggedin = async (req: Request, res: Response, next: NextFunction) => {
    const  user = res.locals.loggedInUser; 
    try {
      if (!user)
          throw new StandardError({message: "Access - login required", data: {user: user }})
       req.body.user = user;
      next();
    } catch (error) {
      if (!(error instanceof  StandardError && error instanceof InternalError)) { 
        error =  new StandardError({message: "Access - login required", data: {user: user }})
      }
      next(error);
    }
  }
  
  // ------------------------------------------------------------

  