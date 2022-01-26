// state.type.ts
// -----------------------------------------------------------

import { ICity } from "./city.type"

// -----------------------------------------------------------

export interface IState  {
    _id: string;
    state_description:  string;
    cities: ICity[];
}

// -----------------------------------------------------------
