/**
 *  joinMySQLtoObject.ts
 */

import { IProduct } from "../types/product.type"
import { IStateCity } from  "../types/state-city.type"
import { ICity } from "../types/city.type"
import { IState }  from  "../types/state.types"
import { IProductCategoryImage } from "../types/product-category-image.type"
import { IImage } from "../types/image.type"
import { ICategory } from "../types/category.type"
import { IPublication } from "../types/publication.type"
import { IPublicationProductCategoryImage } from "../types/publication-product-category-image.type"


/**
 * Function that allows transforming records retrieved from MYSQL related to States and Cities into an object
 * 
 * @param stateCity It receives the list of records of States and Cities retrieved from the database in an array.
 * @returns Returns an array of objects of type IState
 */

export const joinStatesToObject = ( stateCity : Array<IStateCity>): Array<IState> => {
    let aState : Array<IState> = []

    let state_id_ant: string = (stateCity.length)?stateCity[0].state_id:""
    let state_description_ant: string = (stateCity.length)?stateCity[0].state_description:""
    let p = 0
    while (  p < stateCity.length ) {
        let oState  
        let aCities = []

        while (p < stateCity.length && stateCity[p].state_id === state_id_ant ) {
            let oCity : ICity = {
                 _id : stateCity[p].city_id,
                 city_description : stateCity[p].city_description,
                 city_delivery_days : stateCity[p].city_delivery_days,
                 city_shipping_cost : stateCity[p].city_shipping_cost
            }
            aCities.push(oCity)
            p++;
        }
        oState = {
            _id:  state_id_ant,
            state_description:  state_description_ant,
            cities: aCities     
        }
        aState.push(oState)
        if (p < stateCity.length) {
            state_id_ant = stateCity[p].state_id
            state_description_ant = stateCity[p].state_description
            aCities = []
        }
    }

    return aState
}


/**
 * Function that allows transforming records retrieved from MYSQL related to Products into an object
 * 
 * @param aPCI  It receives the list of records of Products, Categories and Images retrieved from the database in an array.
 * @returns Returns an array of objects of type IProduct
 */

export const joinProductsToObject = ( aPCI : Array<IProductCategoryImage>): Array<IProduct> => {
    let aProducts : Array<IProduct> = []

    let product_id_ant: string = (aPCI.length)?aPCI[0]._id:""
    let prod_title_ant: string = (aPCI.length)?aPCI[0].prod_title:""
    let prod_description_ant: string = (aPCI.length)?aPCI[0].prod_description:""
    let prod_price_ant: number = (aPCI.length)?aPCI[0].prod_price:0
    let cat_id_ant: string = (aPCI.length)?aPCI[0].cat_id:""
    let cat_flag_single_ant: boolean = (aPCI.length)?aPCI[0].cat_flag_single:false
    let cat_description_ant: string = (aPCI.length)?aPCI[0].cat_description:""

    let p = 0
    while (  p < aPCI.length ) {
        let oProduct  
        let aImages = []

        while (p < aPCI.length && aPCI[p]._id === product_id_ant ) {

            if ( aPCI[p].image_id !== null ) {
                let oImage : IImage = {
                    _id: aPCI[p].image_id,
                    img_flag_main: aPCI[p].img_flag_main,
                    img_filename:  aPCI[p].img_filename,
                    img_extension: aPCI[p].img_extension
                } 
                aImages.push(oImage)
            }
            p++;
        }

        let oCategory: ICategory = {
            _id:  cat_id_ant,
            cat_flag_single: cat_flag_single_ant,
            cat_description: cat_description_ant  
        }
        
        oProduct = {
            _id: product_id_ant,
            prod_title: prod_title_ant,
            prod_description: prod_description_ant,
            prod_price: prod_price_ant,
            category: oCategory,
            images: aImages
        }

        aProducts.push(oProduct)

        if (p < aPCI.length) {
            product_id_ant = aPCI[p]._id
            prod_title_ant = aPCI[p].prod_title
            prod_description_ant = aPCI[p].prod_description
            prod_price_ant = aPCI[p].prod_price
            cat_id_ant = aPCI[p].cat_id
            cat_flag_single_ant = aPCI[p].cat_flag_single
            cat_description_ant = aPCI[p].cat_description
            aImages = [] 
        }
    }

    return aProducts
}

/**
 * Function that allows transforming records retrieved from MYSQL related to one Product into an object
 * 
 * @param aPCI  Receive a list of registrations for a particular product, with Categories and Images retrieved from the database in an array.
 * @returns Returns an  object of type IProduct
 */
export const joinProductToObject = ( aPCI : Array<IProductCategoryImage>): IProduct => {
    return (joinProductsToObject(aPCI)[0])
}

/**
 * Function that allows transforming records retrieved from MYSQL related to Publications into an object
 * 
 * @param aPCI  It receives the list of records of Publications, Products, Categories and Images retrieved from the database in an array.
 * @returns Returns an array of objects of type IPublication
 */
 export const joinPublicationsToObject = ( aPPCI : Array<IPublicationProductCategoryImage>): Array<IPublication> => {
    let aPublish : Array<IPublication> = []

    let publish_id_ant: string = (aPPCI.length)?aPPCI[0].publication_id:""
    let pub_title_ant: string = (aPPCI.length)?aPPCI[0].pub_title:""
    let pub_description_ant: string = (aPPCI.length)?aPPCI[0].pub_description:""
    let pub_price_ant: number = (aPPCI.length)?aPPCI[0].pub_price:0
    let pub_shipping_cost_ant: number = (aPPCI.length)?aPPCI[0].pub_shipping_cost:0
    let pub_due_date_ant: Date | string = (aPPCI.length)?aPPCI[0].pub_due_date:Date()
    let pub_create_date_ant: Date | string = (aPPCI.length)?aPPCI[0].pub_create_date:Date()
    let category_id_ant: string = (aPPCI.length)?aPPCI[0].category_id:""
    let pub_cat_flag_single_ant: boolean = (aPPCI.length)?aPPCI[0].pub_cat_flag_single:false
    let pub_cat_description_ant: string = (aPPCI.length)?aPPCI[0].pub_cat_description:""

    let p = 0
    while (  p < aPPCI.length ) {
        let aProducts :  Array<IProduct>  | undefined = []
        let oPublish : IPublication  | undefined = undefined
        let oCategory : ICategory  | undefined = undefined

        let aPCI :  Array<IProductCategoryImage>  | undefined = []
        while (p < aPPCI.length && aPPCI[p].publication_id === publish_id_ant ) {
            let oPCI : IProductCategoryImage  =  {
                _id : aPPCI[p].product_id,
                cat_id : aPPCI[p].prod_cat_id,
                image_id : aPPCI[p].image_id,
                prod_title : aPPCI[p].prod_title,
                prod_description : aPPCI[p].prod_description,
                prod_price : aPPCI[p].prod_price,
                cat_flag_single : aPPCI[p].prod_cat_flag_single,
                cat_description : aPPCI[p].prod_cat_description,
                img_flag_main : aPPCI[p].img_flag_main,
                img_filename : aPPCI[p].img_filename,
                img_extension : aPPCI[p].img_extension
            }
            aPCI.push(oPCI)
            p++
        }
        oCategory = {
            _id: category_id_ant,
            cat_flag_single: pub_cat_flag_single_ant,
            cat_description: pub_cat_description_ant
        }
        oPublish = {
            _id: publish_id_ant,
            pub_title:  pub_title_ant,
            pub_description: pub_description_ant,
            category: oCategory,
            pub_price: pub_price_ant,
            pub_shipping_cost: pub_shipping_cost_ant,
            pub_due_date: pub_due_date_ant, 
            pub_create_date: pub_create_date_ant, 
            products: joinProductsToObject(aPCI)
        }        

        aPublish.push(oPublish)

        if (p < aPPCI.length) {
            publish_id_ant = aPPCI[p].publication_id
            pub_title_ant = aPPCI[p].pub_title
            pub_description_ant = aPPCI[p].pub_description
            pub_price_ant = aPPCI[p].pub_price
            pub_shipping_cost_ant = aPPCI[p].pub_shipping_cost
            pub_due_date_ant = aPPCI[p].pub_due_date
            pub_create_date_ant = aPPCI[p].pub_create_date
            category_id_ant = aPPCI[p].category_id
            pub_cat_flag_single_ant = aPPCI[p].pub_cat_flag_single
            pub_cat_description_ant = aPPCI[p].pub_cat_description
            aProducts = [] 
        }
    }
    
    return aPublish
}

/**
 * Function that allows transforming records retrieved from MYSQL related to one Publication into an object
 * 
 * @param aPCI  Receive a list of registrations for a particular publicatio, with Products, Categories and Images retrieved from the database in an array.
 * @returns Returns an  object of type IPublication
 */
export const joinPublicationToObject = ( aPPCI : Array<IPublicationProductCategoryImage>): IPublication => {
    return (joinPublicationsToObject(aPPCI)[0])
}

// ------------------------------------------------------------
