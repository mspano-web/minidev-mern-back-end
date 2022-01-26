/** 
 *  config.ts : This file contains application properties.
 */

import { IApplication, IDatabase, ISecurity, IWebServer, IMail, DEV } from "../types/config.types"
const { InternalError, StandardError } = require('../errors/errors');

/** Singleton pattern  */
let instance:Configuration | null = null

/**
 *  The Configuration class contains the parameterization of the entire Minidev application. 
 *  In the development environment it is obtained from the .env file. In the production environment, 
 *  it is obtained from the configuration of the web server environment
 */

export class Configuration  {

  private _iApp: IApplication = {directoryProductsImages: "", defaultRol: "" };
  private _iDatabase: IDatabase = {type: "", host: "", database: "",  user: "", password: "", connectionLimit: 0 };
  private _iSecurity: ISecurity = {privateKey: "", cors: "" }
  private _iWebServer: IWebServer = {port: "", displayNodeProcess: "",  host: ""}
  private _iMail: IMail = {host: "", port: "",  user: "", passsword: "" }
  private _env: string = ""
  private dotenvParsed:any 

  // ---------------------------------

  constructor() {
      this._env = process.env.NODE_ENV || DEV
      if(this._env === DEV) { this.getEnvironmentDev()} 
      this.setApplication()
      this.setDatabase()
      this.setSecurity()
      this.setWebServer()
      this.setMail()
  }

  /**
   *  Function to obtain the configuration of the development environment, from the .env file
   */

  private getEnvironmentDev() {
    const dotenv = require('dotenv');
    const result = dotenv.config();
    if (result.error) {
      throw new InternalError({message: "Configuration - Gen Environment Dev Fail", data: {error: result.error}})
    }
    const { parsed } = result;
    this.dotenvParsed = parsed
 }

 // ---------------------------------

 /**
  * Getter function of the App property containing the configuration of particular aspects of the application
  */

  public get iApp() {
     return this._iApp;
  }

/**
 * Setter function of the App property containing the configuration of particular aspects of the application
 */
  public set iApp( oApp) {
     this._iApp = oApp;
  }

 /**
  * Getter function of the Database property containing the configuration of particular aspects of the database.
  */
  public get iDatabase() {
     return this._iDatabase;
  }

/**
 * Setter function of the Database property containing the configuration of particular aspects of the database.
 */
  public set iDatabase( oDatabase) {
     this._iDatabase = oDatabase;
  }

  /**
  * Getter function of the Security property containing the configuration of particular aspects of the security.
  */
  public get iSecurity() {
    return this._iSecurity;
  }

/**
 * Setter function of the Security property containing the configuration of particular aspects of the security.
 */
  public set iSecurity( oSecurity) {
    this._iSecurity = oSecurity;
  }

/**
  * Getter function of the Web Server property containing the configuration of particular aspects of the web server.
  */
  public get iWebServer() {
    return this._iWebServer;
  }

/**
 * Setter function of the Web Server property containing the configuration of particular aspects of the web server.
 */
 public set iWebServer( oWebServer) {
    this._iWebServer = oWebServer;
  }

/**
  * Getter function of the Mail property containing the configuration of particular aspects of the mailing.
  */
 public get iMail() {
    return this._iMail;
  }

/**
 * Setter function of the Mail property containing the configuration of particular aspects of the mailing.
 */
 public set iMail( oMail) {
    this._iMail = oMail;
  }

 /**
  * Getter function, allows to obtain the value of the env attribute (execution environment).
  */

  public get env() {
    return this._env;
  }

  /**
  * Setter function, allows setting the value of the env attribute (execution environment).
  */
  public set env( oEnv) {
    this._env = oEnv;
  }


 /**
  * Function that establishes the Security configuration, from the .env file for the development environment; or from the context of the productive environment
  */
  setSecurity() {
    this.iSecurity = { 
      // process.env allows you to access the system and obtain the environment variables.
      privateKey: (this.env === 'DEV')?this.dotenvParsed.PRIVATE_KEY:process.env.PRIVATE_KEY,
      cors: (this.env === 'DEV')?this.dotenvParsed.CORS:process.env.CORS 
     }
     if (!this.iSecurity.privateKey || !this.iSecurity.cors ) { 
      throw new InternalError({message: "Configuration - Security Fail", data: {security: this.iSecurity}})
   }
  }

  /**
   * Function that establishes the application configuration, from the .env file for the development environment; or from the context of the productive environment
   */
  setApplication() {
    let dirImages = this.dotenvParsed.DIRECTORY_PRODUCTS_IMAGES   // Default DEV
    if (this.env !== 'DEV') {
      dirImages = process.env.DIRECTORY_PRODUCTS_IMAGES
    } 
    this.iApp = { 
      directoryProductsImages: dirImages,
      defaultRol: (this.env === 'DEV')?this.dotenvParsed.DEFAULT_ROL:process.env.DEFAULT_ROL
     }
     if (!this.iApp.directoryProductsImages || !this.iApp.defaultRol ) { 
        throw new InternalError({message: "Configuration - Application Fail", data: {app: this.iApp}})
     }
  }

  /**
   * Function that establishes the database configuration, from the .env file for the development environment; or from the context of the productive environment
   */
   setDatabase() {
     this.iDatabase = {
      type: (this.env === 'DEV')?this.dotenvParsed.DB_TYPE:process.env.DB_TYPE,
      host: (this.env === 'DEV')?this.dotenvParsed.DB_HOST:process.env.DB_HOST,
      database: (this.env === 'DEV')?this.dotenvParsed.DATABASE:process.env.DATABASE, 
      user: (this.env === 'DEV')?this.dotenvParsed.DB_USER:process.env.DB_USER, 
      password: (this.env === 'DEV')?this.dotenvParsed.DB_PASSWORD:process.env.DB_PASSWORD, 
      connectionLimit: (this.env === 'DEV')?this.dotenvParsed.DB_CONNECTION_LIMIT || 1:process.env.DB_CONNECTION_LIMIT || 1
    }
    if (!this.iDatabase.host || !this.iDatabase.database || !this.iDatabase.user || 
        !this.iDatabase.password || !this.iDatabase.connectionLimit) { 
          throw new InternalError({message: "Configuration - Application Fail", data: {database: this.iDatabase}})
    }
  } 

  /**
   * Function that establishes the web server configuration, from the .env file for the development environment; or from the context of the productive environment
   */
   setWebServer() {
    this.iWebServer = { 
      port: (this.env === 'DEV')?this.dotenvParsed.PORT:process.env.PORT,
      displayNodeProcess: (this.env === 'DEV')?this.dotenvParsed.DISPLAY_NODE_PROCESS:process.env.DISPLAY_NODE_PROCESS, 
      host: (this.env === 'DEV')?this.dotenvParsed.NODE_HOST:process.env.NODE_HOST
     }
     if (!this.iWebServer.port || !this.iWebServer.displayNodeProcess || !this.iWebServer.host) { 
      throw new InternalError({message: "Configuration - WebServer Fail", data: {webserver: this.iWebServer}})
     }
  }

  /**
   * Function that establishes the email configuration, from the .env file for the development environment; or from the context of the productive environment
   */
   setMail() {
    this.iMail = { 
      host: (this.env === 'DEV')?this.dotenvParsed.EMAIL_HOST:process.env.EMAIL_HOST,
      port: (this.env === 'DEV')?this.dotenvParsed.EMAIL_PORT:process.env.EMAIL_PORT, 
      user: (this.env === 'DEV')?this.dotenvParsed.EMAIL_USER:process.env.EMAIL_USER,
      passsword: (this.env === 'DEV')?this.dotenvParsed.EMAIL_PASSWORD:process.env.EMAIL_PASSWORD
    }
    if (!this.iMail.host || !this.iMail.port || !this.iMail.user || !this.iMail.passsword) { 
      throw new InternalError({message: "Configuration - Email Fail", data: {mail: this.iMail}})
    }
  }

/**
 * Function that allows creating the only Configuration instance, or returning it if it had been previously created. 
 * It allows to implement the singleton pattern.
 * 
 * @returns Returns the only existing configuration instance for the Minidev application
 */
  public static getInstance(): Configuration {
    if(!instance) {
       instance = new Configuration()
    } 
    return instance 
   }
}

// --------------------------------------------------------------

module.exports = Configuration

// --------------------------------------------------------------

