/**
 * users.mysql.ts
 */

import { IUser } from "../../types/user.type";
import { GenericServicesMySQL } from "./generic.mysql";
import { userFindFilters } from  "../../types/search.types"
import { format } from 'mysql2'
const { InternalError, StandardError } = require('../../errors/errors');

/**
 * Class with access functions to the MySQL model, users table.
 */
export class UsersMySQL {

    /**
     * Function that performs the recovery of all users registered in the application.
     * 
     * @returns   Returns user data.
     */

    static async find(): Promise<Array<IUser>> {
        let gS = new GenericServicesMySQL<IUser>();
        let results: Array<IUser> = await gS.find(
          "SELECT _id, usr_name, usr_email, usr_street_address, state_id, city_id, usr_zip, usr_phone_number, usr_username, usr_password,rol_id   FROM users ORDER BY usr_username"
        );
        return results;
    }

    /**
     * Function that performs the recovery of a particular user, registered in the application, that meets a certain search criteria.
     * 
     * @param clv            Field to be used as a key in the "query" that performs the user search.
     * @param valueSearch    Value to search (example: email)
     * @returns              Returns the user's data. 
     */
    static  async findOne(clv: userFindFilters, valueSearch: string): Promise<IUser> {
      let gS = new GenericServicesMySQL<IUser>();
        let  result: IUser
        if (!valueSearch || !clv) 
          throw new InternalError({message: "Get User Fail", data: {valueSearch: valueSearch, clv: clv }})
        const query = `SELECT _id, usr_name, usr_email, usr_street_address, state_id, city_id, usr_zip, usr_phone_number, usr_username, usr_password,rol_id FROM users WHERE ${clv} = ?`
        result =  await gS.findOne(query, valueSearch)

        return result;
    }


   /**
    * Function that performs the recovery of a particular user, registered in the application
    * 
    * @param clv          Field to be used as a key in the "query" that performs the user search.
    * @param valueSearch  Value to search (example: ID)
    * @returns            Returns the user's data. 
    */
    static async finById(clv: userFindFilters, valueSearch: string): Promise<IUser> {
        if (!valueSearch || !clv)
          throw new InternalError({message: "Get User Fail", data: {valueSearch: valueSearch, clv: clv }})
        let result: IUser = await this.findOne(clv, valueSearch)
        return result;
    }
    
    /**
     * Function that performs the registration of a new user.
     * 
     * @param user    New user data.
     * @returns       Returns the ID of the created user.
     */
    static async create(user: IUser): Promise<number> {
      let newId: number = 0
      let gS = null

        if (!user) throw new InternalError({message: "Create User Fail", data: {user: user }})
        gS = new GenericServicesMySQL<IUser>();
  
        const insertQuery = 'INSERT INTO USERS (usr_name, usr_email, usr_street_address, state_id, city_id, usr_zip, usr_phone_number, usr_username, usr_password, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const query = format(insertQuery,[user.usr_name, user.usr_email, user.usr_street_address, user.state_id,user.city_id,  user.usr_zip, user.usr_phone_number, user.usr_username, user.usr_password, user.rol_id]) 
    
        newId = await gS.create(query)
      return newId;
    }

    /**
     * Function that updates the data of a user registered in the application. 
     * 
     * @param user      User data.
     * @param id        User ID. 
     * @returns         Returns true if the operation was successful and false otherwise.
     */
    static async updateOne(user: IUser, id: string): Promise<boolean> {
      let gS = new GenericServicesMySQL<IUser>();
      let  result: boolean = false
  
        if (!user || !id) throw new InternalError({message: "Update User Fail", data: {user: user, id: id }})
  
        const insertQuery = 'UPDATE USERS SET usr_name = ?, usr_email = ?, usr_street_address = ?, state_id = ?, city_id = ? ,usr_zip = ?, usr_phone_number = ? WHERE _id = ?';
        const query = format(insertQuery,[user.usr_name, user.usr_email, user.usr_street_address, user.state_id, user.city_id, user.usr_zip, user.usr_phone_number, parseInt(id)]) 
        result = await gS.updateOne(query)
      return result;
    }
}

// -------------------------------------------------------------
