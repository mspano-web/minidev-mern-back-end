// publication.type.ts
// -----------------------------------------------------------

import { ICategory } from "./category.type"
import { IProduct } from "./product.type"

// -----------------------------------------------------------

export interface IPublication  {
    _id: string,
    pub_title:  string,
    pub_description:  string,
    category: ICategory;
    pub_price: number,
    pub_shipping_cost: number,
    pub_create_date:  Date | string,
    pub_due_date: Date | string,
    products: IProduct[]
    
}
  
// -----------------------------------------------------------