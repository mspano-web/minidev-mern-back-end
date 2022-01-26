/**
 * users.services.ts
 */

import { UserModel } from "../models/mongo/users.model";
import { StateModel } from "../models/mongo/states.model";
import { IUser } from "../types/user.type";
import { encryptPassword, verifyPassword } from "../helpers/encrypt";
import { getRolIdByDescription, getRolById } from "./roles.services";
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { IRol } from "../types/role.type";
import { emailCheckFormat } from "../helpers/validate_email_formatl";
import { ILoginSuccess } from "../types/login_success.type";
import * as TokenService from "../services/tokens.services";
import { sendEmail } from "../helpers/send.email";
import { UsersMySQL } from "../models/mysql/users.mysql";
require("dotenv").config();
const jwt = require("jsonwebtoken");
import { userFindFilters } from "../types/search.types"
import { IShipping } from "../types/shipping.type";
import { StateMySQL } from "../models/mysql/states.mysql";
import { IState } from "../types/state.types";
const { StandardError, InternalError } = require('../errors/errors');


/**
 * Service function, processes the business case of obtaining request from all users registered in the application. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @returns Returns the data of the users found.
 */
export const getUsers = async function (): Promise<Array<IUser>> {
  let users: Array<IUser> = [];

  try {
    (Configuration.getInstance().iDatabase.type === MONGO)
      ? (users = await UserModel.find({},{ createdAt:0, updatedAt:0 }))
      : (users = await UsersMySQL.find()); 
    } catch (e) {
      if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
      else {  throw new InternalError({message: "Get Users Fail", data: {}, exception: e}) }      
    }

  return users;
};

/**
 * Service function, processes the business case of request to obtain the data of a particular user, 
 *    registered in the application. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param usr_id  User ID to search.
 * @returns Returns the user's data.
 */
export const getUser = async function (usr_id: string): Promise<IUser | null> {
  let user: IUser | null = null;

  try {
    if(!usr_id) throw new InternalError({message: "Get User Fail", data: {usr_id: usr_id}})

    if (Configuration.getInstance().iDatabase.type === MONGO) {
       user = await UserModel.findOne({ _id: usr_id }, { _id: 0 })
    } else {
       user = await UsersMySQL.findOne(userFindFilters.Id, usr_id)
    }

  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get User Fail", data: {usr_id: usr_id}, exception: e}) }      
}
  return user;
};

/**
 * Service function, processes the business case of request to obtain the shipping data of a particular user, 
 *    registered in the application. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param usr_id  User ID to search.
 * @returns Returns the user's data.
 */
 export const getShipping = async function (usr_id: string): Promise<IShipping | null> {
  let user: IUser | null = null
  let stateCity: IState | null = null
  let shipping: IShipping | null = null

  try {
    if(!usr_id) throw new InternalError({message: "Get User Shipping Fail", data: {usr_id: usr_id}})

    if (Configuration.getInstance().iDatabase.type === MONGO) {
       user = await UserModel.findOne({ _id: usr_id }, { _id: 0 })
    } else {
       user = await UsersMySQL.findOne(userFindFilters.Id, usr_id)
    }
    if (user) {
      if (Configuration.getInstance().iDatabase.type === MONGO) {
        stateCity = await StateModel.findOne({ _id: user.state_id}, { _id: 0 })
     } else {
        stateCity = await StateMySQL.findOne(user.state_id, user.city_id)
     }

     shipping  = {
      state_id: stateCity?._id,
      city_id: stateCity?.cities[0]._id,
      city_delivery_days: stateCity?.cities[0].city_delivery_days,
      city_shipping_cost: stateCity?.cities[0].city_shipping_cost
     } as IShipping

    }

  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get User Shipping Fail", data: {usr_id: usr_id}, exception: e}) }      
}
return shipping;
};


/**
 * Service function, processes the business case of request to obtain the data of a particular user, 
 *   from their email. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * @param email Email to use as a reference in the search
 * @returns  Returns the user's data.
 */
const findEmail = async function (email: string): Promise<IUser | null> {
  let user: IUser | null = null;

  try {
    if(!email) throw new InternalError({message: "Get User Fail", data: {email: email}})

    if (Configuration.getInstance().iDatabase.type === MONGO) {
      user = await UserModel.findOne({ usr_email: email })
    } else {
      user = await UsersMySQL.findOne( userFindFilters.Email, email);
    } 
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get User Fail", data: {email: email}, exception: e}) }      
  }
  return user;

};

/**
 * Service function, processes the business case of requesting to obtain the data of a particular user, 
 *     based on their username. 
 *     Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param username Username to search for.
 * @returns Returns the user's data.
 */
const findUserName = async function (username: string): Promise<boolean> {
  let user: IUser | null = null;

  try {
    if(!username) throw new InternalError({message: "Get User Fail", data: {username: username}})

    if (Configuration.getInstance().iDatabase.type === MONGO) {
     user = await UserModel.findOne({ usr_username: username },{ createdAt:0, updatedAt:0 })
    } else {
      user = await UsersMySQL.findOne( userFindFilters.Username, username);
    } 
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get User Fail", data: {username: username}, exception: e}) }      
  }
  return user ? true : false;
};

/**
 * Service function, processes the business case of registering a user in the application, 
 *    based on the data provided. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 *    Rules:
 *      1) The username must not exist in the users collection.
 *      2) The email must not exist in the users collection
 *      3) The password must be encrypted
 *      4) All roles are mapped to the STANDARD role. ADMIN users are only created by initial script.
 * 
 * @param user User information to register.
 * @returns Returns the ID of the new user.
 */
export const registerUser = async function (user: IUser): Promise<number> {
  try {
    let newId : number = 0


    if(!user) throw new InternalError({message: "Register User Fail", data: {user: user}})
    let { usr_password, usr_email, usr_username, rol_id } = user;
    if(!usr_password || !usr_email || !usr_username) 
      throw new InternalError({message: "Register User Fail", data: {usr_password: usr_password, usr_email: usr_email, usr_username: usr_username}})
      let userNew = JSON.parse(JSON.stringify(user));
    if (!Configuration.getInstance().iApp.defaultRol) 
        throw new InternalError({message: "Register User Fail", data: {user: user, defaultRol:Configuration.getInstance().iApp.defaultRol}})
    if (await findUserName(usr_username)) 
        throw new StandardError({message: "Register User Fail - username exists", data: {user: user}})
    if (await findEmail(usr_email)) 
        throw new StandardError({message: "Register User Fail - emmail exists", data: {user: user}})
    if (!emailCheckFormat(usr_email)) throw Error("Email incorrect");
    userNew.usr_password = await encryptPassword(usr_password);

    let rol = await getRolById(rol_id)
    
    if (rol === null || rol === undefined) 
        throw new StandardError({message: "Register User Fail - rol inexistent", data: {user: user, rol: rol}})
    userNew.rol_id = rol._id; // Add field

    if (Configuration.getInstance().iDatabase.type === MONGO) {
        newId = (await UserModel.create(userNew))._id
      } else {
       newId = await UsersMySQL.create(userNew); 
      }
    return newId;
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Register User Fail", data: {user: user}, exception: e}) }      
  }
};


/**
 * Service function, processes the business case of a user's login request in the application.
 *     Depending on the database system in use, it invokes the corresponding model handler.
 *     Rules:
 *          1) The email and password must correspond.
 *          2) A token is generated to send to the client, so that it can be authenticated later 
 *             to use the system. Said token will be sent in the header, Authorization field.
 * 
 * @param usr_password  User password
 * @param usr_email     User's email
 * @returns Successful login. (Token and role).
 */
export const loginUser = async function (usr_password: string, usr_email: string): Promise<ILoginSuccess> {
  try {
    let loginSuccess: ILoginSuccess = { usr_id: "", usr_token: "", usr_rol_name: "", usr_username: "" };

    if (!usr_password || !usr_email ) 
        throw new InternalError({message: "Login User Fail", data: {usr_password: usr_password, usr_email: usr_email}})

    if (!emailCheckFormat(usr_email)) 
        throw new StandardError({message: "Login User Fail - email incorrect", data: {usr_email: usr_email}})
    const user: IUser | null | undefined = await findEmail(usr_email);

    if (user === null || user === undefined) 
        throw new StandardError({message: "Login User Fail - user inexistent", data: {usr_email: usr_email}})
    const bPassword = await verifyPassword(usr_password, user.usr_password);
    if (!bPassword) throw new StandardError({message: "Login User Fail - password incorrect", data: {usr_password: usr_password}})
    // Token is generated
    loginSuccess.usr_token = await jwt.sign(
      { id: user._id.toString() },
      process.env.PRIVATE_KEY,
      { expiresIn: 60 * 60 * 24 } // Seconds
    );

    const rol: IRol | null  = await getRolById(user.rol_id);
 
    if (rol === null) 
      throw new StandardError({message: "Login User Fail - rol inexistent", data: {usr_email: usr_email}})
    loginSuccess.usr_rol_name = rol.rol_name;
    loginSuccess.usr_id = user._id;
    loginSuccess.usr_username = user.usr_username;
    return loginSuccess;
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Login User Fail", data: {usr_password: usr_password, usr_email: usr_email}, exception: e}) }      
  }
};

/**
 * Service function, processes a user's data modification business case. 
 *     Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param user      New user data.
 * @param user_id   ID of the user to update.
 * @returns   Returns true on success, or false on failure.
 */
export const updatedUser = async function (user: IUser, user_id: string): Promise<boolean> {
  try {
    let result: boolean = false;

    if (!user || !user_id ) 
      throw new InternalError({message: "Update User Fail", data: {user: user, user_id: user_id}})

    if (Configuration.getInstance().iDatabase.type === MONGO) {
      await UserModel.updateOne({ _id: user_id }, { $set: user })
        .then((obj) => {
          result = true
        })
        .catch((e) => {
          throw new InternalError({message: "Update User Fail", data: {user: user, user_id: user_id}})
        });
    } else {
      result = await UsersMySQL.updateOne(user, user_id )
    }
    return result;
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Update User Fail", data: {user: user, user_id: user_id}, exception: e}) }      
  }
};

/**
 * Service function, processes the business case of requesting a password for a particular user.
 *    Depending on the database system in use, it invokes the corresponding model handler.
 *    Rules:
 *      1) Email with valid format
 *      2) Email existing in the application.
 *      3) If token exists and is valid, use it; if it doesn't exist create one.
 *      4) Generate a link to reset the password.
 *      5) Send an email to the user with the password reset link.
 * 
 * @param usr_email  User email
 * @returns Reply message.
 */
export const forgotPassword = async function (usr_email: string): Promise<string | null> {
  try {
    let userResult: IUser;

  
    if (!usr_email ) 
      throw new InternalError({message: "Forgot Password User Fail", data: {usr_email: usr_email}})
    if (!emailCheckFormat(usr_email)) 
        throw new StandardError({message: "Forgot Password User Fail - email incorrect", data: {usr_email: usr_email}})
    const user = await findEmail(usr_email);
    if (!user) 
      throw new StandardError({message: "Forgot Password User Fail - non-existent email", data: {usr_email: usr_email}})
      try {
        await TokenService.deleteUserToken(user._id);
      } catch {
        // In case of not being able to delete the token, it continues. 
        // It would be convenient to validate that the error was caused by NOT FOUND and not for another reason.
      }
     const token = await TokenService.createUserToken(user._id);

    // The user has a valid time to use the link.
    // The link takes you to the password change page.
    // This page leads to the endpoint: / users / resetpassword /: id /: token
    // The token can only be used once
    let link: string =
      "To reset your password in Minidev, select the following link:  ";
      link = link +
          `http://${Configuration.getInstance().iWebServer.host}/users/resetpassword/${user._id}/${token?.tok_generated}`

    await sendEmail(user.usr_email, "Minidev - 	Password reset", link);
    return "Password reset link sent to your email account";
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Forgot Password User Fail", data: {usr_email: usr_email}, exception: e}) }      
  }
};

/**
 * Service function, processes the password change request business case of a particular user.
 *    Depending on the database system in use, it invokes the corresponding model handler.
 *    Rules:
 *      1) Validate that the user exists in the application.
 *      2) Retrieve the valid token generated for the user.
 *      3) Compare the token provided in the request with the token registered in the application. They must match.
 *      4) Encrypt the new user key.
 *      5) Update the user password in the application.
 *      6) Delete the token used.
 *      7) Send an email notifying the user of the password change made.
 * 
 * @param usr_id       User ID
 * @param token        Token provided by the user (it should be the one that was sent by mail)
 * @param newPassword  New user password
 * @returns Reply message.
 */
export const resetPassword = async function (usr_id: string, token: string, newPassword: string): Promise<string> {
  try {

    if (!usr_id || !token || !newPassword) 
      throw new InternalError({message: "Reset Password User Fail", data: {usr_id: usr_id, token: token, newPassword: newPassword}})
    const user = await getUser(usr_id);
    if (!user) 
      throw new StandardError({message: "Reset Password User Fail - user inexistent", data: {usr_id: usr_id}})
    const tokenResult = await TokenService.findUserToken(usr_id);
    if (!tokenResult) 
      throw new StandardError({message: "Reset Password User Fail - invalid token or inexistent", data: {usr_id: usr_id}})
    if (tokenResult.tok_generated !== token) {
      if(tokenResult.tok_expiration < new Date()) {
        throw new StandardError({message: "Reset Password User Fail - the link has expired. Generate a new forgotten password request.", data: {usr_id: usr_id, token: token, tok_generated: tokenResult.tok_generated}})
      } else {
        throw new StandardError({message: "Reset Password User Fail - invalid link.", data: {usr_id: usr_id, token: token, tok_generated: tokenResult.tok_generated}})
      }
    }
    user.usr_password = await encryptPassword(newPassword);
    await updatedUser(user, usr_id);
    await TokenService.deleteUserToken(usr_id);
    await sendEmail(user.usr_email, "Minidev - 	Password reset", "Password reset sucessfully");
    return "password reset sucessfully.";
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Reset Password User Fail", data: {usr_id: usr_id, token: token, newPassword: newPassword}, exception: e}) }      
  }
};

// ------------------------------------------------------------
