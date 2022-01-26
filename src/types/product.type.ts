// product.type.ts
// -----------------------------------------------------------

import { ICategory } from "./category.type"
import { IImage } from "./image.type"

// -----------------------------------------------------------

export interface IProduct  {
    _id: string;
    prod_title: string;
    prod_description: string;
    prod_price: number;
    category: ICategory;
    images: IImage[];
  }

  // -----------------------------------------------------------
