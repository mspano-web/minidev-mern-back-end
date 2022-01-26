/**
 * states.services.ts
 */

import { StateModel } from "../models/mongo/states.model";
import { IState }  from "../types/state.types"
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { StateMySQL } from "../models/mysql/states.mysql"
import { joinStatesToObject } from "../helpers/joinMySQLtoObject"
const { StandardError, InternalError } = require('../errors/errors');

/**
 * Service function, processes the business case of obtaining request from all associated states and cities registered in the application. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @returns  Returns the data of the states and cities found.
 */
export const getStates = async function (): Promise<Array<IState>> {
    let states: Array<IState> = [];

    try {
      if (Configuration.getInstance().iDatabase.type === MONGO) {
        states = await StateModel.find()
      } else {
        const statesCities = await StateMySQL.find(); 
        if (statesCities !== undefined) states = joinStatesToObject(statesCities)
      }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get States Fail", data: {}, exception: e}) }    
  }
  return states;
};

/**
 * Service function, processes the business case of obtaining request from all associated states and cities registered in the application. 
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @returns  Returns the data of the states and cities found.
 */
 export const getStateCiti = async function (): Promise<Array<IState>> {
  let states: Array<IState> = [];

  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      states = await StateModel.find()
    } else {
      const statesCities = await StateMySQL.find(); 
      if (statesCities !== undefined) states = joinStatesToObject(statesCities)
    }
} catch (e) {
  if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
  else {  throw new InternalError({message: "Get States Fail", data: {}, exception: e}) }    
}
return states;
};

  // ------------------------------------------------------------
