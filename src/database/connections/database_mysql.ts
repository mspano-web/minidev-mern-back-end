/**
 *  database_mysql.ts : Establish connection to the Mongo database.
 */

const Configuration = require("../../config/config");
import { MYSQL } from "../../types/config.types"
import { createPool, Pool } from 'mysql2'
const { InternalError } = require('../../errors/errors');

// --------------------------------------------------------------

// Singleton pattern 
let instance:connectMySql | null = null

/**
 * Class that allows to establish and maintain the connection with the MySQL database.
 */

class connectMySql {
    private host: string
    private user: string
    private password: string
    private database: string
    private connectionLimit: number
    private _pool: Pool | null
    private cfg: any

    // ---------------------------------------------

    constructor() {
        this.cfg = Configuration.getInstance()
        if ( this.cfg.iDatabase.type !== MYSQL ||
             !this.cfg.iDatabase.host ||
             !this.cfg.iDatabase.user ||
             !this.cfg.iDatabase.password ||
             !this.cfg.iDatabase.database ||
             !this.cfg.iDatabase.connectionLimit) {
            throw new InternalError({message: "Incorrect configuration in MySQL", data: this.cfg});
        }
        this._pool = null
        this.host =  this.cfg.iDatabase.host
        this.user = this.cfg.iDatabase.user
        this.password = this.cfg.iDatabase.password
        this.database = this.cfg.iDatabase.database
        this.connectionLimit = this.cfg.iDatabase.connectionLimit
        }

    // ---------------------------------------------

    // createPool allows a pool of connections to be ready to be loaned.
          // Connection pools help reduce the time spent connecting to the MySQL server by 
          // reusing a previous connection, leaving them open instead of closing when you are
          // done with them.
          // The pool does not create all connections upfront but creates them on demand until 
          // the connection limit is reached.



    /**
     * Function that allows creating the connection pool from the pre-established configuration.
     */
     private connect(): Pool | void {
          this._pool  =  createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectionLimit: this.connectionLimit,
            waitForConnections: true,
            queueLimit: 0,
            //  ssl  : {
            //     ca : fs.readFileSync('<path to CA cert file>'),
            //     rejectUnauthorized: true
            // }
            });

            if (!this._pool) throw new InternalError({message: "Fail created connection MySQL pool", data: {host:this.host, user: this.user, password: this.password, database:this.database, connectionLimit: this.connectionLimit}});
    }

    /**
     * Function that allows you to set the level of transactional isolation.
     */
    private async setTransactionIsolation() {

        if (!this._pool) throw Error("Invalid connection in setTransactionIsolation")
        this._pool.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    }

    /**
     * Getter function that allows to obtain the pool of connections established in the class
     */
    get pool(): Pool {
     if (!this._pool) throw new InternalError({message: "Undefined connection MySQL pool", data: {host:this.host, user: this.user, password: this.password, database:this.database, connectionLimit: this.connectionLimit}}); 
     return this._pool
    }

    /**
     * Function that allows creating the only Connection MYSQL instance, or returning it if it had been previously created. 
     * It allows to implement the singleton pattern.
     * 
     * @returns Returns the only existing connection mysql instance for the Minidev application
     */
    public static getInstance(): connectMySql {
        if(!instance) {
            instance = new connectMySql()
            instance.connect()
            instance.setTransactionIsolation() 
        }
     return instance 
    }
}

module.exports = connectMySql

// --------------------------------------------------------------
