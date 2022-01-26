// product-category-image.type.ts
// -----------------------------------------------------------

export interface IProductCategoryImage  {
    _id: string,
    cat_id: string,
    image_id: string,
    // -------------------
    prod_title: string,
    prod_description: string,
    prod_price: number,
    // -------------------
    cat_flag_single: boolean,
    cat_description: string,
    // -------------------
    img_flag_main: boolean,
    img_filename: string,
    img_extension: string
}

// -----------------------------------------------------------
