/**
 * generic.mysql.ts
 */

const connectMySql = require("../../database/connections/database_mysql");
const { InternalError } = require('../../errors/errors');
import { ResultSetHeader } from "mysql2";
import Pool from "mysql2/typings/mysql/lib/Pool";
import { PoolConnection } from "mysql2";

/**
 * Class with general access functions to the MySQL model.
 */
export class GenericServicesMySQL<T> {
  private _pool: any
  private _connection: PoolConnection | undefined
  private _txn: boolean = false

  // --------------------------------------------------

  public constructor() {
    this._pool = this.getPool();
    this._connection = undefined
  }

    /**
     * Function that gets the MySQL connection pool.
     * 
     * @returns Pool of connections registered in the system.
     */
    private getPool() {
      const pool = connectMySql.getInstance().pool;
      if (!pool) throw new InternalError({message: "Generic Service Mysql Pool Fail!"})
      return pool
    }

  /**
   * Function that gets a connection from the pool.
   * 
   * @param pool    Pool of connections
   * @returns       Connection obtained.
   */  
    private getConnection(pool: Pool): Promise<PoolConnection> {
         return new Promise((resolve, reject) => {
          if (this._connection ) { 
            resolve(this._connection)
          } else {
            pool.getConnection((e: any, connection: any): void => {
              if (e) { 
                  reject(new InternalError({message: "Generic Service MySQL Connection Fail", data: {} }))
              } else {
                this._connection = connection
                resolve(connection)
              }
            })
          }
      })
    }

  /**
   * Function that starts a transaction on the active connection.
   * 
   * @returns Returns true if the operation was successful, false otherwise.
   */
  public async beginTransaction(): Promise<boolean> {
      const connection = await  this.getConnection(this._pool)
      if (this._txn) new InternalError({message: "Generic Service MySQL Beig Transaction Fail", data: {} })      
      this._txn = true
      return new Promise((resolve, reject) => {
        connection.beginTransaction( function (err: any) {
              if (err) {
                connection.release();
                reject(new InternalError({message: "Generic Service MySQL Begin Transaction Fail", data: {} }));
              } else {
                resolve(true);
              }
            })
          } 
        )
  }

/**
 * Function that makes a transaction effective on the active connection.
 * 
 * @returns Returns true if the operation was successful, false otherwise.
 */
  public async commitTransaction(): Promise<boolean> {
    if (!this._txn) new InternalError({message: "Generic Service MySQL Commit Transaction Fail", data: {} })
    const connection = await  this.getConnection(this._pool)
    this._txn = false
    return new Promise((resolve, reject) => {
              connection.commit( function (err: any)  {
                connection.release();
                if (err) {
                  reject(new InternalError({message: "Generic Service MySQL Commit Transaction Fail", data: {} }));
                } else {
                  resolve(true);
                }
            })
          } 
        )
  }

/**
 * Function that reverts a failed transaction on the active connection.
 * 
 * @returns Returns true if the operation was successful, false otherwise.
 */  
  public async rollbackTransaction(): Promise<boolean> {
    if (!this._txn) new InternalError({message: "Generic Service MySQL Rollback Transaction Fail", data: {} })
    const connection = await  this.getConnection(this._pool)
    this._txn = false
    return new Promise((resolve, reject) => {
      connection.rollback( () => {
          connection.release();
          return resolve(true)
       })
       reject(false)
      } 
    )
  }

  /**
   * Function that performs a search query, obtaining from 0 to N records.
   * 
   * @param query   Query to execute. (SELECT)
   * @returns       Records obtained.
   */
  public async find(query: string): Promise<Array<T>> {

    if (!query) throw InternalError({message: "find - Parameter indefined", data: {query: query}});
    const connection = await  this.getConnection(this._pool)
    return new Promise((resolve, reject) => {
        connection.query(query, (e: any, results: Array<T>) => {
          if (!this._txn) connection.release()
          if (e) { 
            reject(new InternalError({message: "find in MySQL", data: {query: query}, exception: e})) 
          } else {
            resolve(results)
          }
        })
      }
    )
  }
  

  public async count(query: string): Promise<number> {

    if (!query) throw InternalError({message: "count - Parameter indefined", data: {query: query}});
    const connection = await  this.getConnection(this._pool)
    return new Promise((resolve, reject) => {
        connection.query(query, (e: any, result: any) => {
          if (!this._txn) connection.release()
          if (e) { 
            reject(new InternalError({message: "count in MySQL", data: {query: query}, exception: e})) 
          } else {
            resolve(result[0].TOTAL)
          }
        })
      }
    )
  }

  /**
   * Function that performs a search query, obtaining 1 record.
   * 
   * @param query       Query to execute. (SELECT)
   * @param condition   Search condition 
   * @returns           Record obtained.
   */
  public async findOne(query: string, condition: string | undefined = undefined): Promise<T> {
    if (!query) throw InternalError({message: "findOne - Parameter indefined", data: {query: query}});
    const connection = await this.getConnection(this._pool)
    return new Promise((resolve, reject) => {
        connection.query(query, [condition], (e: any, results: any) => {
        if (!this._txn) connection.release()
        if (e) { 
          reject(new InternalError({message: "findOne in MySQL", data: {query: query}, exception: e})) 
        } else {
            resolve(results[0])
        }
        })
    })
  }

  /**
   * Function that performs a search query, under some criteria, obtaining from 0 to N records.
   * 
   * @param query       Query to execute. (SELECT)
   * @param condition   Search condition 
   * @returns           Records obtained.
   */
  public async findSome(query: string, condition: string | undefined = undefined): Promise<Array<T>> {
    if (!query || !condition) throw InternalError({message: "findSome - Parameter indefined", data: {query: query, condition: condition}});
    const connection = await  this.getConnection(this._pool)
    return new Promise((resolve, reject) => {
        connection.query(query, [condition], (e: any, results: any) => {
        if (!this._txn) connection.release()
        if (e) { 
          reject(new InternalError({message: "findSome in MySQL", data: {query: query, condition: condition}, exception: e})) 
        }  else {
          resolve(results)
        }
        })
    })
  }

/**
 * Function that inserts a new record in the database.
 * 
 * @param query   Query to execute. (INSERT)
 * @returns       New ID.
 */
  public async  create(query: string): Promise<number> {
    if (!query) throw InternalError({message: "create - Parameter indefined", data: {query: query}});
    const connection = await  this.getConnection(this._pool)

    return new Promise((resolve, reject) => {
            connection.query(query, (e: any, result: ResultSetHeader) => {
            if (!this._txn) connection.release()
            if (e) {  
              reject(new InternalError({message: "create in MySQL", data: {query: query}, exception: e})) 
            } else {
              resolve(result.insertId)  // The promise is resolved
            }
          })
    })
  }

/**
 * Function that updates a record in the database.
 * 
 * @param query     Query to execute.(UPDATE)
 * @returns         Returns true if the operation was successful, false otherwise.
 */
public async updateOne(query: string): Promise<boolean> {
  if (!query) throw InternalError({message: "updateOne - Parameter indefined", data: {query: query}});
  const connection = await  this.getConnection(this._pool)
  return new Promise((resolve, reject) => {
        connection.query(query, (e: any, QResult: ResultSetHeader) => {
          if (!this._txn) connection.release()
          if (e || !QResult.affectedRows) { 
            reject(new InternalError({message: "updateOne in MySQL", data: {query: query}, exception: e})) 
          } else {
            resolve(Boolean(QResult.changedRows))
          }
        })
  })
}

/**
 * Function that deletes a record in the database.
 * 
 * @param query       Query to execute. (DELETE)
 * @param condition   Search criteria
 * @returns           Returns true if the operation was successful, false otherwise.
 */
public async deleteOne(query: string, condition: string): Promise<boolean> {
  if (!query || !condition) throw InternalError({message: "deleteOne - Parameter indefined", data: {query: query, condition: condition}});
  const connection = await  this.getConnection(this._pool)
  return new Promise((resolve, reject) => {
        connection.query(query, [condition], (e: any, result: ResultSetHeader) => {
        if (!this._txn) connection.release()
        if (e) { 
          reject(new InternalError({message: "deleteOne in MySQL", data: {query: query, condition: condition}, exception: e})) 
        } else {
          resolve((result.affectedRows)?true:false)
        }
        })
  })
}

/**
 * Function that deletes records in the database.
 * 
 * @param query         Query to execute. (DELETE)
 * @param condition     Search criteria
 * @returns             Returns true if the operation was successful, false otherwise.
 */
public async deleteSome(query: string, condition: string): Promise<boolean> {
  if (!query || !condition) throw InternalError({message: "deleteSome - Parameter indefined", data: {query: query, condition: condition}});
  const connection = await  this.getConnection(this._pool)

  return new Promise((resolve, reject) => {
        connection.query(query, [condition], (e: any, result: ResultSetHeader) => {
          if (!this._txn) connection.release()
          if (e) { 
            reject(new InternalError({message: "deleteSome in MySQL", data: {query: query, condition: condition}, exception: e})) 
          } else {
            resolve((result.affectedRows)?true:false)
          }
        })
  })

}

}

// ------------------------------------------------------------------------------------------

