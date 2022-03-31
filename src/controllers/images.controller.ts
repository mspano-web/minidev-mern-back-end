/**
 * images.controller.ts
 */

const fs = require('fs');
import { Request, Response, NextFunction } from "express";
const ImageService = require("../services/images.services");
const ProductService = require("../services/products.service");
const path = require("path");
const Cfg = require("../config/config");
import { IImage } from "../types/image.type"
const { StandardError, InternalError } = require('../errors/errors');

/**
 * Controller function, gets the list of products by invoking the corresponding service, 
 *  and then renders the list of products on the server using EJS Engine.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
  */
 export const getListProducts = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await ProductService.getProducts();

    // Express render the file and convert it to HTML
    res.render("index_products", {
      title: "Product image file management",
      products: products,
    });
    return
  } catch (e: any) {
    next(e)
  }
};
 

/**
 * Controller function, given a product, retrieves the associated information by invoking the corresponding service, 
 *   and then renders that information and its associated images on the server using EJS Engine.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const getImagesProduct = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product_id  = req.query.id
    if(!product_id) throw new InternalError({message: "Get Images Fail", data: {product_id: product_id }})
    const product = await ProductService.getProduct(product_id);
    const pathbase = path.join(__dirname, Cfg.getInstance().iApp.directoryProductsImages)
    
    res.render("index_images_product", {
      title: "Product image file management",
      prod_title: product.prod_title,
      prod_description: product.prod_description,
      product: product,
      pathbase: pathbase
    });
    return
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controller function, renames image files uploaded in the application (in this case with the multer middleware), 
 *    adapting them to the product name reference with its corresponding sequence. 
 *    Then it invokes the corresponding service to register the referential data of said image in the database 
 *    and associate them with the corresponding product.
 *    
 *  
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */ 
export const uploadImages = async function (req: Request, res: Response, next: NextFunction) {
  try {
    let separator: string
    if(process.platform.includes("win")) {
        separator = "\\"
    } else {
      separator = "//"
    }
    const originalName = req.body.pathbase + separator + req.body.originalname;
    const extension: string = originalName.slice((originalName.lastIndexOf(".") - 1 >>> 0) + 2)
    const newNameToRename: any = req.body.product_id +"_" + req.body.new_image_id + "." + extension; 
    const newPathToRename = req.body.pathbase + separator + newNameToRename
 
    let oImage : IImage = {
      img_flag_main: false,
      img_filename: path.parse(newNameToRename).name,
      img_extension: extension
    }
    const product_id = req.body.product_id

    if (!product_id) throw new StandardError({message: "Upload image without data", data: {product_id: product_id}})
    await ImageService.updatedImages(product_id, oImage);

    fs.copyFile(originalName, newPathToRename, (error: any) => {
      if (error) throw(error);
    })

    res.redirect(`/images/images-products?id=${product_id}`)
    
    return 
  } catch (e: any) {
    next(e)
  }
};


/**
 * Controller function, it removes the image of a certain product by invoking the corresponding service.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const deleteImages = async function (
  req: Request,
  res: Response,
  next: NextFunction 
) {
  try {
  
    const product_id = req.params.id
    const img_filename = req.query.filename
    const img_extension =  req.query.extension
    if(!product_id || !img_filename || !img_extension) 
      throw new InternalError({message: "Delete Images Fail", data: {product_id: product_id, img_filename: img_filename, img_extension: img_extension }})

    await ImageService.deleteImages(product_id, img_filename, img_extension );
    res.redirect(`/images/images-products?id=${product_id}`)

    return res.status(200).json();
  } catch (e: any) {
    next(e)
  }
};

// --------------------------------------------------------------------
