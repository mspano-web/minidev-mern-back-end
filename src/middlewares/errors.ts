/**
 * errors.ts 
 */

import {Request, Response, NextFunction, ErrorRequestHandler} from "express"
const { InternalError, StandardError } = require('../errors/errors');
import { App } from "../app"

/**
 * Middleware that allows logging in the application an error occurred in the system with the error level 
 *    according to the type of exception that was originally thrown.
 * 
 * @param e     Exception
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Go to the Next middleware
 */

const errorLogger: ErrorRequestHandler = (e: any, req: Request, res: Response, next: NextFunction) => {
    if (!e) return next();
    if (e instanceof InternalError) { 
        App.logger.log({level: 'error', message: JSON.stringify(e._iError) + "\n Stack -> " + e.stack});
    } else {
        if (e instanceof StandardError) {
            App.logger.log({level: 'warn',message: e});
        } else {
            App.logger.log({level: 'warn',message: e});
        }
    }
    next(e) // calling next middleware
}
    
/**
 * Function that formats an error occurred in the system and returns the response to whoever made the failed request.
 * 
 * @param e     Exception
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Go to the Next middleware
 */  
  const errorResponder: ErrorRequestHandler = (e: any, req: Request, res: Response, next: NextFunction) => {
    if (!e) return next();
     res.header("Content-Type", 'application/json')
     if (e._iError.statusCode === null || e._iError.statusCode === undefined) e._iError.statusCode = 400;
     res.status(e._iError.statusCode).json( e._iError.message)
  }

module.exports = { errorLogger, errorResponder }

// -------------------------------------------------------------------------------------------
