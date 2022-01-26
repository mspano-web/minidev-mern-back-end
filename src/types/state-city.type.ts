// states-cities.type.ts
// -----------------------------------------------------------

export interface IStateCity  {
    state_id: string,
    city_id: string,
    // ------------------------
    state_description:  string,
    // ------------------------
    city_description: string,
    city_delivery_days: number,
    city_shipping_cost: number
}

// -----------------------------------------------------------
