/**
 * tokens.mysql.ts
 */

import { IToken } from "../../types/token.type"
import { GenericServicesMySQL } from "./generic.mysql";
import { tokenFindFilters } from  "../../types/search.types"
import { format } from 'mysql2'
const { InternalError } = require('../../errors/errors');

/**
 * Class with access functions to the MySQL model, tokens table.
 */
export class TokensMySQL {

  /**
   * Function that performs the retrieval of a token associated with a user.
   * 
   * @param clv             Field to be used as a key in the "query" that performs the token search.
   * @param valueSearch     Value to search (example: ID)
   * @returns               Returns the token data
   */
  static async findOne(clv: tokenFindFilters, valueSearch: string): Promise<IToken> {
      let gS = new GenericServicesMySQL<IToken>();
      let  result: IToken 

      if (!valueSearch || !clv) { "Token search error" }
      const query = `SELECT tok_generated FROM tokens WHERE ${clv} = ?`
      result = await gS.findOne(query, valueSearch)

      return result;
  }

    /**
     * Function that performs the registration of a token associated with a specific user.
     * 
     * @param token     Token to register
     * @returns         Returns the ID of the token created.
     */
    static async create(token: IToken): Promise<number> {
        if (!token) throw new InternalError({message: "Create Token Fail", data: {token: token }})
        let gS = new GenericServicesMySQL<IToken>();
          
        if (!token) { throw Error("Token creation error") }
        const insertQuery = 'INSERT INTO TOKENS (usr_id, tok_generated, tok_expiration) VALUES (?, ?, ?)';
        const query = format(insertQuery,[token.usr_id, token.tok_generated, token.tok_expiration]) 
    
        return (await gS.create(query))
    }

    /**
     * Function that performs the elimination of a token associated with a specific user.
     * 
     * @param clv           Field to be used as a key in the "query" that performs the token search.
     * @param valueSearch   Value to search (example: ID)
     * @returns             Returns true if the operation was successful and false otherwise.
     */
    static async deleteOne(clv: tokenFindFilters, valueSearch: string): Promise<boolean> {
          if (!clv || !valueSearch) throw new InternalError({message: "Delete Token Fail", data: {clv: clv, valueSearch: valueSearch }})
          let gS = new GenericServicesMySQL<IToken>();
          let  result: boolean
    
          if (!valueSearch || !clv) { throw Error("Token deletion error"); }
          const query = `DELETE FROM tokens WHERE ${clv} = ?`
          result = await gS.deleteOne(query, valueSearch)
    
          return result;
      }

}

// -------------------------------------------------------------
