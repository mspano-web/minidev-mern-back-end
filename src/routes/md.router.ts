/**
 * md-routers.ts : Express route controllers for all the endpoints of the app
 */

import { Router } from "express";
import * as productController from "../controllers/products.controller"
import * as categoriesController from "../controllers/categories.controller"
import * as configurationController from "../controllers/configuration.controller"
import * as statesController from "../controllers/states.controller"
import * as publicationsController from "../controllers/publications.controller"
import * as usersController from "../controllers/users.controller"
import * as contactsController from "../controllers/contacts.controller"
import * as salesController from "../controllers/sales.controller"
import * as imagesController from "../controllers/images.controller"
import * as rolesController from "../controllers/roles.controller"

import {allowIfLoggedin, grantAccess} from "../middlewares/secutiry_controls"
import { uploadSingleProduct } from "../helpers/upload"

// ---------------------------------------------------------------

const router : Router = Router();

/* 
   A router object is an isolated instance of middleware and routes. 
   You can think of it as a “mini-application,” capable only of performing 
     middleware and routing functions. 
   Every Express application has a built-in app router.
*/

// Products --------------------------------------------------------------
router

    .get("/products",  productController.getProducts)
    .get("/products/:id",  productController.getProduct)

// Comments: The next 2 lines would replace the previous 2. 
//            Security validation is added. It is necessary to modify the header in the front-end sending security data.
// .get("/products", grantAccess('readAny', 'products'), allowIfLoggedin, productController.getProducts)
// .get("/products/:id", grantAccess('readAny', 'products'), allowIfLoggedin, productController.getProduct)

// States --------------------------------------------------------------
    .get("/states",  statesController.getStates)

//  Comments: 
//    .get("/states", grantAccess('readOwn', 'users'), allowIfLoggedin, statesController.getStates)


// Roles  --------------------------------------------------------------
    .get("/rol/standard",  rolesController.getRolStandard) 

// Users --------------------------------------------------------------
    .get("/users/shipping/:id",  usersController.getUserShipping) 
    .get("/users/",  usersController.getUsers) 
    .get("/users/:id",  grantAccess('readOwn', 'users'), allowIfLoggedin, usersController.getUser)
    .post("/users/login", usersController.loginUser)
    .post("/users/register", usersController.registerUser) 
    .post("/users/forgotpassword/", usersController.forgotPassword)
    .put("/users/resetpassword/:id", usersController.resetPassword)
    .put("/users/:id", grantAccess('readOwn', 'users'), allowIfLoggedin, usersController.updateUser)

// Categories --------------------------------------------------------------
    .get("/categories", categoriesController.getCategories)
    .get("/categories/:id", categoriesController.getCategory)

// Sales  --------------------------------------------------------------
    .post("/sales", grantAccess('createAny', 'sales'), allowIfLoggedin, salesController.createSale)

// Publications  --------------------------------------------------------------
    .get("/publications",  publicationsController.getPublications)
    .get("/publications/total",  publicationsController.getPublicationsTotal)
    .get("/publications/title",  publicationsController.getPublicationsbyTitle)
    .get("/publications/title/total",  publicationsController.getPublicationsbyTitleTotal)
    .get("/publications/category/:id",  publicationsController.getPublicationsbyCategory)
    .get("/publications/category/total/:id",  publicationsController.getPublicationsbyCategoryTotal)
    .get("/publications/:id", publicationsController.getPublication)
    .post("/publications", grantAccess('readAny', 'publications'), publicationsController.createPublication)
    .put("/publications/:id", grantAccess('updateAny', 'publications'), allowIfLoggedin, publicationsController.updatePublication)

// Contact  --------------------------------------------------------------
    .post("/contacts", contactsController.createContact)

// Configurations  --------------------------------------------------------------
    .get("/configuration",  configurationController.getConfiguration)

// Product Images--------------------------------------------------------------
    .get("/images/list-products", imagesController.getListProducts)  // Entry point
    .get("/images/images-products/", imagesController.getImagesProduct)
    .post("/images/upload", uploadSingleProduct, imagesController.uploadImages)
    .get("/images/delete/:id",  imagesController.deleteImages)

  export default router;  

  // ---------------------------------------------------------------
