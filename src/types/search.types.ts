// search.types.ts
// ------------------------------------------------------------------------------------------

export enum userFindFilters {
    Username = "usr_username",   
    Email = "usr_email",
    Id = "_id"
}

// ----------------------------------

export enum rolFindFilters {
    Rolename = "rol_name",   
    Id = "_id"
}

// ----------------------------------

export enum tokenFindFilters {
    UserId = " usr_id"
}

// ----------------------------------

export enum productFindFilters {
    ProductId = " p._id"
}

// ----------------------------------

export enum imageFindFilters {
    ImageFileName = " img_filename"
}

// ----------------------------------

export enum publicationFindFilters {
    PublicationTile = " pub_title",
    PublicationCategoryId = "cat_id",
    PublicationId = "_id",
    PublicationProduct = "pub_id", 
    PublicationCategoryIdTotal = "cat_id"
}

// ----------------------------------

export enum categoriesFindFilters {
    CategoryId = "_id",   
}

// ----------------------------------
