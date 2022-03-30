/**
 * database_mongo.ts : Establish connection to the Mongo database.
 */


// mongoose : is a MongoDB object modeling tool designed to work in an asynchronous environment.
//             Mongoose ODM (Object Data Model)  to access our library data. Mongoose acts as a front end to MongoDB.
//             The benefit of using an ORM is that programmers can continue to think in terms of JavaScript objects 
//                 rather than database semantics. 
import mongoose, { ConnectionOptions } from "mongoose"; // MongoDB
const Configuration = require("../../config/config");
import { MONGO, DEV } from "../../types/config.types"
const { InternalError, StandardError } = require('../../errors/errors');

/**
 * Function that allows to establish a connection to the Mongo database according to system configuration parameters.
 */

export const connectMongoDatabase = async () => {
  let URI: string = ""
  const mongooseOptions: ConnectionOptions = {  // Connections set's
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    /*
    user: cfg.iDatabase.user,
    pass: cfg.iDatabase.password
    */
  };

  try {
     const cfg =  Configuration.getInstance()

    if (cfg.iDatabase.type !== MONGO) {
      throw new InternalError({message: `Incorrect configuration in MONGO: ${MONGO}`, data: {} })       
    }

    // The goal is to hide the connection data in environment variables.
    // The .env file would contain the definition of these variables.

    const HOST = cfg.iDatabase.host
    
    if (  cfg.env === DEV ) 
      URI = `mongodb://${HOST}:27017/${cfg.iDatabase.database}`;
    else 
      URI = `mongodb+srv://${cfg.iDatabase.user}:${cfg.iDatabase.password}@${HOST}/${cfg.iDatabase.database}?retryWrites=true&w=majority`
      // Heroku production environment - Atlas MongoDB

    await mongoose.connect(URI, mongooseOptions);
      
     const db: mongoose.Connection  = mongoose.connection;

  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Connection to Mongo database failed", data: {mongooseOptions: mongooseOptions, URI: URI} , exception: e}) }      
  }
 
};

// --------------------------------------------------------------
