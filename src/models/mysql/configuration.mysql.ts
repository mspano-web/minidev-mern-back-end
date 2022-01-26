/**
 * configuration.mysql.ts
 */

import { IConfiguration } from "../../types/configuration.type";
import { GenericServicesMySQL } from "./generic.mysql";

/**
 * Class with access functions to the MySQL model, configuration table.
 */
  export class ConfigurationMySQL {

    /**
     * Function that performs application configuration retrieval.
     * 
     * @returns Returns the application settings.
     */
    static async findOne(): Promise<IConfiguration>  {
        let gS = new GenericServicesMySQL<IConfiguration>();

        let result: IConfiguration = await gS.findOne(
                 "SELECT conf_delivery_time_from, conf_delivery_time_to,  conf_path_image_prod, conf_name_image_prod_default FROM configurations LIMIT 1"
        );
        return result;
    }
}


// -------------------------------------------------------------
