/**
 *  upload.ts : Upload an image file to disk
 */

const multer = require("multer");
const path = require("path");
const Configuration = require("../config/config");

// ---------------------------------------------------

/*
   multer : is a node.js "middleware" for Express for handling 'multipart / form-data', 
            which is mostly used for file uploads.
 */ 


/**
 *  Configuring Multer.
 *    The disk storage engine gives you full control on storing files to disk.
 *    There are two options available, destination and filename.
 *    They are both functions that determine where the file should be stored.
 */
const storage: any = multer.diskStorage({
  // Directory where the files will be saved.
  destination: (req: any, file: any, cb: any) => {
    cb(null, path.join(__dirname, Configuration.getInstance().iApp.directoryProductsImages));
  },
  // New file name.
  filename: (req: any, file: any, cb: any) => {
    req.body.originalname =  file.originalname;
    req.body.mimetype = file.mimetype;
    req.body.pathbase = path.join(__dirname, Configuration.getInstance().iApp.directoryProductsImages)
    cb(null, file.originalname);
  },
});
export const uploadSingleProduct = multer({ storage }).single("image");

// ---------------------------------------------------
