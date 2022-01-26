// publication-product-category-image.type.ts
// -----------------------------------------------------------

export interface IPublicationProductCategoryImage  {
    publication_id: string,
    product_id: string,
    category_id: string,
    image_id: string,
    // -------------------
    pub_title: string,
	pub_description: string, 
	pub_price: number,
    pub_shipping_cost: number,
	pub_due_date: Date | string,
    pub_create_date: Date | string,
    // -------------------
    pub_cat_flag_single: boolean,
    pub_cat_description: string,
    // -------------------
    prod_title: string,
    prod_description: string,
    prod_price: number,
    prod_cat_id: string,
    prod_cat_flag_single: boolean,
    prod_cat_description: string,
    // -------------------
    img_flag_main: boolean,
    img_filename: string,
    img_extension: string
}

// -----------------------------------------------------------

