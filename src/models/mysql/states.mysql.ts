/**
 * states.mysql.ts
 */

import { IStateCity }  from "../../types/state-city.type"
import { IState } from "../../types/state.types";
import { GenericServicesMySQL } from "./generic.mysql";
const { InternalError } = require('../../errors/errors');

/**
 * Class with access functions to the MySQL model, states and cities table.
 */
export class StateMySQL {

  /**
   * Function that performs the retrieval of data from states and associated cities.
   * 
   * @returns Returns the data of the states and their associated cities.
   */
  static async find(): Promise<Array<IStateCity>> {
      let gS = new GenericServicesMySQL<IStateCity>();

      // Inner Join
      let results: Array<IStateCity> = await gS.find(
        "SELECT states._id AS  state_id, cities._id AS city_id, states.state_description, city_description, city_shipping_cost, city_delivery_days FROM cities JOIN states ON  cities.state_id = states._id order by states.state_description;"
      );
      return results;
  }


/**
   * Function that performs the data recovery of a particular state / city.
   * 
   * @returns Returns the data of the state and their associated city.
   */
 static async findOne(state: string, city: string): Promise<IState> {
  let gS = new GenericServicesMySQL<IStateCity>();
  
  // Inner Join
  let result: IStateCity = await gS.findOne(
    `SELECT states._id AS  state_id, 
        cities._id AS city_id, 
        states.state_description, 	
        city_description, 
        city_shipping_cost, 
        city_delivery_days 
    FROM cities 
      JOIN states ON  cities.state_id = states._id 
    WHERE state_id = ${state}
      AND cities._id = ${city}
    ORDER BY states.state_description; `
    );

  const stateCity : IState = {
    _id: result.state_id,
    state_description:  result.state_description,
    cities: [
      {
        _id: result.city_id,
        city_description: result.city_description,
        city_delivery_days: result.city_delivery_days,
        city_shipping_cost: result.city_shipping_cost
      }
    ]

  }

  return stateCity;
}


}