/**
 * users.controller.ts
 */

import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/user.type";
import { ILoginSuccess } from "../types/login_success.type";
import { IShipping } from "../types/shipping.type";
const UsersService = require("../services/users.services");
const { StandardError } = require('../errors/errors');

/**
 * Controller function, processes a request to obtain the data of all users, 
 *     invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getUsers = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const users = await UsersService.getUsers();
    return res.status(200).json(users);
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controller function, processes a request to obtain a particular user, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const getUser = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const usr_id: string = req.params.id;
    if (!usr_id) throw new StandardError({message: "Get User without data", data: {usr_id: usr_id}})
    const user: IUser = await UsersService.getUser(usr_id);
    return res.status(200).json( user );
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controller function, processes a request to obtain the delivery data for a particular user, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const getUserShipping = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const usr_id: string = req.params.id;
    if (!usr_id) throw new StandardError({message: "Get Shipping without data", data: {usr_id: usr_id}})
    const shipping: IShipping = await UsersService.getShipping(usr_id);
    return res.status(200).json(shipping);
  } catch (e: any) {
    next(e)
  }
};


/**
 * Controller function, processes a request to register a new user in the application, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const registerUser = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUser = req.body;
    if (!user) throw new StandardError({message: "Register User without data", data: {user: user}})
    await UsersService.registerUser(user);
    return res.status(200).json();
  } catch (e: any) {
    next(e)
  }
}; 

/**
 * Controller function, processes a request to log in a user in the application, 
 *    from the email and password, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const loginUser = async function (req: Request, res: Response, next: NextFunction) {
  try {
    let { usr_password, usr_email } = req.body;
    if (!usr_password || !usr_email) throw new StandardError({message: "Login User without data", data: {usr_email: usr_email, usr_password: usr_password}})
    const loginSuccess: ILoginSuccess = await UsersService.loginUser(usr_password, usr_email);
    return res.status(200).json(loginSuccess);
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controller function, processes a request to update the information of a user in the application, 
 *   invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const updateUser = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUser = req.body;
    if (!user) throw new StandardError({message: "Update User without data", data: {user: user}})
    await UsersService.updatedUser(user, req.params.id);
    return res.status(200).json();
  } catch (e: any) {
    next(e)
  }
};
 
/**
 * Controller function, processes a request to be able to modify the password of a user (phase I), 
 *    from his email, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const forgotPassword = async function (req: Request, res: Response, next: NextFunction) {
  try {
    let usr_email  = req.body.email;
    if (!usr_email) throw new StandardError({message: "Forgot Password User without data", data: {usr_email: usr_email}})
    const message = await UsersService.forgotPassword(usr_email);
    return res.status(200).json(message);
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controller function, processes a request to change the password of a user (phase II), 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const resetPassword = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.params.id;
    const { newPassword, token } = req.body;
    if (!user_id || !newPassword || !token) 
      throw new StandardError({message: "Reset Password User without data", data: {user_id: user_id, newPassword: newPassword, token: token }})
    const Result = await UsersService.resetPassword(user_id, token, newPassword);
    return res.status(200).json(Result);
  } catch (e: any) {
    next(e)
  }
};

// --------------------------------------------------------------------
