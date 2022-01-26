/**
 * tokens.services.ts
 */

import { TokenModel } from "../models/mongo/tokens.model";
import { IToken } from "../types/token.type";
import * as  crypto from "crypto"
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { TokensMySQL } from "../models/mysql/tokens.mysql";
import { tokenFindFilters } from "../types/search.types" 
const { StandardError, InternalError } = require('../errors/errors');

/**
 * Service function, processes the business case of registering a token for a particular user in the application. 
 *     Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param user_id User ID
 * @returns Returns the generated token.
 */
export const createUserToken = async function (user_id: string): Promise<IToken> {
    try {

      let result : any = undefined
      if(!user_id) throw new InternalError({message: "Creation Token Fail", data: {user_id: user_id}})

      if( Configuration.getInstance().iDatabase.type === MONGO) {
         result = await TokenModel.create({usr_id: user_id, tok_generated: crypto.randomBytes(32).toString("hex")})
      } else {
        const token: IToken = {
          usr_id: user_id,
          tok_generated: crypto.randomBytes(32).toString("hex"),
          tok_expiration:  new Date(Date.now() + (60 * 10 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
        }
        await TokensMySQL.create(token);
        result = token
      }
      return (result)

    } catch (e) {
      if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
      else {  throw new InternalError({message: "Creation Token Fail", data: {user_id: user_id}, exception: e}) }      
    }
  };

  /**
   * Service function, processes the search business case of the token associated with a specific user. 
   *     Depending on the database system in use, it invokes the corresponding model handler.
   * 
   * @param user_id  User ID
   * @returns Returns the token associated with the user.
   */
  export const findUserToken = async function (user_id: string): Promise<IToken| null> {
    try {

      let result: IToken | null = null
      if(!user_id) throw new InternalError({message: "Get Token Fail", data: {user_id: user_id}})

      if (Configuration.getInstance().iDatabase.type === MONGO) {
        result = await TokenModel.findOne({usr_id: user_id})
      } else {
        result = await TokensMySQL.findOne(tokenFindFilters.UserId, user_id ); 
      }

       return (result)
    } catch (e) {
      if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
      else {  throw new InternalError({message: "Get Token Fail", data: {user_id: user_id}, exception: e}) }      
    }
  };

  /**
   * Service function, processes the business case of deleting a token associated with a user. 
   *    Depending on the database system in use, it invokes the corresponding model handler.
   * 
   * @param user_id User ID
   * @returns Returns true on success, or false on failure.
   */
  export const deleteUserToken = async function (user_id: string): Promise<boolean> {
    try {
        let result: boolean = false
        if(!user_id) throw new InternalError({message: "Delete Token Fail", data: {user_id: user_id}})

        if (Configuration.getInstance().iDatabase.type === MONGO) {
          await TokenModel.deleteOne({ usr_id: user_id })
            .then(function() {
              result = true
            }).catch(function(e) {
              throw Error("Token delete error");
            });
        } else {
          result = await TokensMySQL.deleteOne(tokenFindFilters.UserId, user_id ); 
        }
        return result
    } catch (e) {
      if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
      else {  throw new InternalError({message: "Delete Token Fail", data: {user_id: user_id}, exception: e}) }      
    }
  };

  // -----------------------------------------------------------------------