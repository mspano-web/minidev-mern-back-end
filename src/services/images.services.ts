/**
 * images.services.ts
 */

const path = require("path");
const fs = require("fs");
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { ProductModel } from "../models/mongo/products.model";
import { IImage } from "../types/image.type"
import { ImageMySQL } from "../models/mysql/image.mysql"
import { imageFindFilters } from "../types/search.types"
const { InternalError, StandardError } = require('../errors/errors');

/**
 * Service function, processes the business case of registration or data modification of a certain image associated with a product. 
 *     Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param product_id Product ID associated with the image.
 * @param oImage Image data.
 * @returns Returns true on success, or false on failure.
 */
export const updatedImages = async function (product_id: string, oImage: IImage): Promise<boolean> {
  let resultUpdate: boolean = false
  try {
    
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      await ProductModel.updateOne({ _id: product_id },{$push: {images: oImage,},}, { upsert: true})
         .then (
            (result: any) => {
                const { matchedCount, modifiedCount } = result;
                if(matchedCount && modifiedCount) {
                  resultUpdate = true;
                }
              }
        )  
        .catch( 
            (err: any) => { throw new InternalError({message: "Upload Images Fail", data: {product_id: product_id, image: oImage}}) }
        )
      } else {
        const imageResult = await ImageMySQL.create(product_id, oImage); 
        if (imageResult) resultUpdate = true;
      }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Upload Images Fail", data: {product_id: product_id, image: oImage}, exception: e}) 
  }

  }
  return resultUpdate;
};

/**
 * Service function, processes the business case of deleting data from a certain image associated with a product, 
 *   and its corresponding file on disk. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param product_id    Product ID associated with the image.
 * @param img_filename  Image file name
 * @param img_extension Image file extension
 * @returns Returns true on success, or false on failure.
 */
export const deleteImages = async function (product_id: string, img_filename: string, img_extension: string): Promise<boolean> {
  let resultDelete: boolean = false

  try {
    const pathbase = path.join(__dirname, Configuration.getInstance().iApp.directoryProductsImages)
    const fullPathImage = path.join(pathbase, img_filename) + "." + img_extension

    fs.unlinkSync(fullPathImage)

    if (Configuration.getInstance().iDatabase.type === MONGO) {

      await ProductModel.updateOne({ _id: product_id },{$pull: {images: {img_filename: img_filename},},}, { upsert: true} )
      .then (
          (result: any) => {
              const { matchedCount, modifiedCount } = result;
              if(matchedCount && modifiedCount) {
                resultDelete = true
              }
            }
      )  
      .catch( 
          (err: any) => { throw new InternalError({message: "Delete Images Fail", data: {product_id: product_id, img_filename: img_filename, img_extension: img_extension }}) }
      )
    } else {
      await ImageMySQL.deleteOne(imageFindFilters.ImageFileName, img_filename ); 
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Delete Images Fail", data: {product_id: product_id, img_filename: img_filename, img_extension: img_extension }, exception: e}) }
  }
  return resultDelete
};

// ------------------------------------------------------------


