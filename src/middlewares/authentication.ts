/**
 *  authentication.ts 
 */


import {Request, Response, NextFunction} from "express"
import jwt from 'jsonwebtoken'
const Configuration = require("../config/config");
import { getUser } from "../services/users.services";
const { InternalError, StandardError } = require('../errors/errors');


// jwt - jsonwebtoken : provides a means of representing claims to be transferred between two parties 
//                      ensuring that the information transferred has not been tampered with by an 
//                      unauthorized third party, we’ll see exactly how this works later on.

// ------------------------------------------------------------

/**
 * Function that obtains from the request header, security values ​​such as the token and the user's role, 
 *    and validates them in the system, enabling or not the user to make their request.
 * 
 * @param req Request
 * @param res Response
 * @param next Next function (middleware)
 */
export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const configuration: any = Configuration.getInstance()
      if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        if (!configuration.iSecurity.privateKey) 
            throw new InternalError({message: "Authentication - Invalid security jwt configuration", data: {}})

          // Authenticate user
          jwt.verify(accessToken.toString(), 
                     configuration.iSecurity.privateKey, 
                     async (err: any, decoded: any) => {      
                      // decoded: When performing jwt.sign on login, the token is generated from the user_id
                      //           and the secret key.
                      //           Running jwt.verify extracts the user_id and expiration times.
                      //           Example: {id: '615f46248292483be0d7a548', iat: 1633633992, exp: 1633720392}
                      //           The token goes back and forth in the header of each HTTP request. 
                      //           This allows each user to manage their own token.
                       if (err === null) { 
                          if (decoded.exp < Date.now().valueOf() / 1000) {
                            throw new StandardError({message: "Authentication - JWT token has expired", data: {expiration: decoded.exp}})
                          }
                          // The allowIfLoggedin method is invoked from the router. This method uses the value of res.locals.loggedInUser. 
                          // The id is assigned so that if allowIfLoggedin is executed before getUser() has a value and does not reject authorization.
                          // The invocation to getUser () should be passed inside allowIfLoggedin() and check the assigned id to avoid this desynchronism.
                          res.locals.rol_name = req.headers["x-security-role"];
                          res.locals.loggedInUser = decoded.id  
                          res.locals.loggedInUser = await getUser(decoded.id);
                          res.locals.rol_name = req.headers["x-security-role"];
                          if (!res.locals.rol_name) 
                            throw new StandardError({message: "Authentication - undefined role", data: {rol_name: req.headers["x-security-role"]}})
                        } 
                      }  
                  ) 
      }  
      next(); 
    } catch (error) {
      next(error);
    }
 };

// -------------------------------------------------------------------------------------------
