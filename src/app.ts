/**
 * app.ts 
 */

import express, { Application } from 'express'
import morgan from 'morgan'
import { Configuration } from './config/config'
import { DEV, MONGO } from "./types/config.types"
import path from "path"
const ejs = require('ejs')                          
const winston = require('winston')
const expressWinston = require('express-winston')
import helmet from 'helmet' 
import cors from "cors"
import { authentication } from "./middlewares/authentication"
import mdRoutes from "./routes/md.router"
const configuration = require("./config/config");
import { infoProcessSystem } from "./helpers/info.system";
import { connectMongoDatabase } from "./database/connections/database_mongo";
const { errorLogger, errorResponder } = require('./middlewares/errors')
const { StandardError, InternalError } = require('./errors/errors');

// ----------------------------------------------------

/**
 *  App is the main class of the Minidev application
 */

export class App {
    private app: Application
    private configuration: Configuration
    static logger: any
    private corsOptions: any

    //------------------

    constructor() {
        this.app = express() // The express() function is a top-level function exported by the express module.
        this.configuration = configuration.getInstance()
        this.settings()
        this.database()
        this.middlewares()
        this.routes()
    }

    //------------------

    /**
     *  Function to obtain system configuration.
     * 
     * @returns  Returns the object containing the system configuration
     */
    public getConfiguration() {
        if(!configuration) throw Error("Configuration Fail")
        return configuration
    }

    /**
     * Function to configure the system Cors.
     */
    private setCors() {
         this.corsOptions = {
            origin: this.configuration.iSecurity.cors
          };
    }

    /**
     *  Function to configure the login in Winston
     */
    private setWinston() {
        this.app.use(expressWinston.logger({   // express-winston logger makes sense BEFORE the router
            transports: [new winston.transports.Console({ level: 'silent' })],
            
            format: winston.format.combine(winston.format.colorize(),winston.format.json()                )
        }));
        App.logger = winston.createLogger({
            level: (this.configuration.env === DEV)?'debug':'info',   // maximum level of log messages to log
            // 0: error 1: warn 2: info 3: http 4: verbose 5: debug 6: silly 
            format: winston.format.json(), // the format of log messages
            // defaultMeta: { service: 'user-service' },
            transports: [  // set of logging destinations for log messages
              // Winston comes with three core transports: console, file, and HTTP
              //
              // - Write all logs with level `error` and below to `error.log`
              // - Write all logs with level `info` and below to `combined.log`
              //
              new winston.transports.File({ filename: 'error.log', level: 'error' , maxsize: 2000000 }),
              new winston.transports.File({ filename: 'warning.log', level: 'warn' , maxsize: 2000000 }),
              new winston.transports.File({ filename: 'info.log', level: 'info' , maxsize: 2000000 }),
            ],
          });
          if (this.configuration.env === DEV) {
            const myformat = winston.format.cli({ colors: { info: 'blue' }});
            App.logger.add(new winston.transports.Console({
                format: myformat
            }));
          }
          
    }

    /**
     *  Function to set the port configuration of the web server, view engine, Winston and Cors
     */

    private settings() {
        this.app.set('port', this.configuration.iWebServer.port); // Set a port variable from an environment variable
        this.app.set('views', path.join(__dirname, '/views'));  // "views", the directory where the template files are located.
        this.app.set('view engine', 'ejs'); // "view engine", the template engine to use. (in our case ejs)
        this.setWinston()
        this.setCors()
    }
    
    /**
     *  Function to establish the connection to the database. Particularly to MongoDB.
     */

    private database() {
        
        // Connection to Mongo according to environment configuration.
        // The connection to MySQL is made when obtaining a connection to perform a query
        App.logger.info({message: 'App - Database initialization... '});
        if (!this.configuration.iDatabase.type) throw Error("Incorrect environment configuration.");
        if (this.configuration.iDatabase.type === MONGO) connectMongoDatabase()
    }

    /**
     * Function to initialize the system middlewares
     */

    private middlewares() {
    // A middleware in Express processes and transforms incoming requests on the server.
    App.logger.info({message: 'App - Middleware initialization... '});
        this.app.use(morgan('dev'));  // // morgan: HTTP request logger middleware for node.js
        // helmet: helps protect your application from some known web vulnerabilities by properly setting HTTP headers.
        //         X-Powered-By - Automatically disables the X-Powered-By header. Attackers can use this header to detect applications running Express 
        //                        and initiate targeted attacks.
        //        frameguard    - Sets the X-Frame-Options in the header to prevent clickjacking attacks.
        //                        Clickjacking is an attack that tricks a user into clicking an element on the web page that is invisible or disguised 
        //                        as another element. This can lead users to unknowingly download malware, visit malicious web pages, provide credentials 
        //                        or sensitive information, transfer money, or purchase products online.
        this.app.use (helmet ({ frameguard: { action: "deny"}})); 
        // cors: allows connection between different servers.
        //      cors is a piece of Express.js middleware that allows us to enable cross-origin resource sharing.
            //      Without this, our API would only be usable from front ends being served from the exact same subdomain as our back end.
        this.app.use(cors(this.corsOptions)); 
        // json() object processing. This is a built-in middleware function in Express.
        //  It parses incoming requests with JSON payloads and is based on body-parser.
        this.app.use(express.json());
        // body-parser : is used to parse incoming data from request bodies such as form data and
        //               attaches the parsed value to an object which can then be accessed by an express middleware.
        //               Understanding fields sent from a form with POST method.
        this.app.use(express.urlencoded({ extended: false })); 
        this.app.use(authentication)
        // Define static files access
        // As the folder is published, it may be accessed by the browser or another client.
        this.app.use(express.static(path.join(__dirname, '../public'))); 
        // Special addressing method, app.all (), which is not derived from any HTTP method.
        // This method is used to load middleware functions into a path for all request methods.
        this.app.all("/secret", function (req, res, next) { next() });
    }

    /**
     * Function to handle the different routes (end points), errors generated in them, and route not found.
     */

    private routes() {
        App.logger.info({message: 'App - Routes initialization... '});
        // A router behaves like middleware itself, so you can use it as an
        //  argument to app.use() or as the argument to another router’s use() method.
        this.app.use(mdRoutes);

       // Error Custom Handler
       this.app.use(errorLogger)
       this.app.use(errorResponder)
       
       // It applies if you cannot find the requested route.
        this.app.get("*", function (req, res, next) {
            App.logger.log({level: 'warn', message: "Enpoint not found."});
            res.status(404).json({ status: 404, msg: "Enpoint not found." });
            next();
        });
    }

    /**
     * Function to raise the web server. In addition, it exposes the Node information at the system level if its exposure is configured.
     */

    async listen() {
        try {
            App.logger.info({message: 'App - Listen initialization... '});
            this.app.listen(this.app.get('port'), () => {
                App.logger.info({message: `Server on port: ${this.app.get('port')}`});
            });
            if (this.configuration.iWebServer.displayNodeProcess) infoProcessSystem(); // Exposes Node JS system information.
        } catch(e) {
            App.logger.log({level: 'warn',message: 'Listen fail!'});
            throw Error("Listen fail")
        }
    }
}

// ----------------------------------------------------


