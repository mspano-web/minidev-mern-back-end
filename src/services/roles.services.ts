/**
 * roles.services.ts
 */

import { RolesModel } from "../models/mongo/roles.model";
import { IRol } from "../types/role.type"
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { rolFindFilters } from "../types/search.types"
import { RolesMySQL } from "../models/mysql/roles.mysql"
const { StandardError, InternalError } = require('../errors/errors');


/**
 * Service function, processes the request business case to obtain the role of a user given his name. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param rol_name name of the role to search.
 * @returns  Returns the id associated with the name searched.
 */
export const getRolIdByDescription = async function (rol_name: string): Promise<IRol | null> {
  let rol: IRol | null = null;
  try {
    if(!rol_name) throw new InternalError({message: "Get Rol Fail", data: {rol_name: rol_name}})

    if (Configuration.getInstance().iDatabase.type === MONGO) {
        rol = await RolesModel.findOne({ rol_name: rol_name });
    } else {
        rol = await RolesMySQL.findOne(rolFindFilters.Rolename, rol_name) 
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Rol Fail", data: {rol_name: rol_name}, exception: e}) }      
  }
  return rol;
};

/**
 * Service function, processes the request business case to obtain the role of a user given its ID. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param id  ID of the role to search.
 * @returns Returns the data of the role associated with the search ID.
 */
export const getRolById = async function (id: string): Promise<IRol | null> {
  let rol:IRol | null = null
  try {
    if(!id) throw new InternalError({message: "Get Rol Fail", data: {id: id}})
    
    if (Configuration.getInstance().iDatabase.type === MONGO) {
     rol = await RolesModel.findById(id)
    } else {
     rol = await RolesMySQL.findById(rolFindFilters.Id, id)
    }

  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Rol Fail", data: {id: id}, exception: e}) }      
  }
  return rol;
};

// ------------------------------------------------------------

/**
 * Service function, processes the request business case to obtain the role standard. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @returns  Returns the rol associated with the standard role.
 */
 export const getRolStandard = async function (): Promise<IRol | null> {

  const rolStandardDescription: string = Configuration.getInstance().iApp.defaultRol
  const rol: IRol | null = await getRolIdByDescription(rolStandardDescription);

  return rol;
};

