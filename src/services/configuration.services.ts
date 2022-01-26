/**
 * configuration.services.ts
 */

import { ConfigurationModel } from "../models/mongo/configuration.model";
import { IConfiguration } from "../types/configuration.type";
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { ConfigurationMySQL} from "../models/mysql/configuration.mysql"
const { InternalError, StandardError } = require('../errors/errors');

/**
 * Service function, processes the application configuration request business case. 
 *   Depending on the database system in use, it invokes the corresponding model handler
 * 
 * @returns Returns the settings registered in the system.
 */
export const getConfiguration = async function (): Promise<IConfiguration | null > {

    let configuration: IConfiguration | null;

    try {
        if (Configuration.getInstance().iDatabase.type === MONGO) {
          configuration = await ConfigurationModel.findOne({},{ _id: 0 })
        } else {
          configuration = await ConfigurationMySQL.findOne();
        }
    } catch (e) {
        if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
        else {  throw new InternalError({message: "Get Configuration Fail", data: {}, exception: e}) }    
    }
    
     return configuration;
}

// ------------------------------------------------------------
