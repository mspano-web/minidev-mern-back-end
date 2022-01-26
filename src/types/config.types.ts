// config.types.ts 
// --------------------------------------------------------------

export interface  IApplication  {
    directoryProductsImages: string, 
    defaultRol: string
}

// ----------------------------

export interface  IDatabase  {
    type: string,
    host: string,
    database: string, 
    user: string ,
    password: string,
    connectionLimit: number
} 

// ----------------------------

export interface ISecurity {
    privateKey: string,
    cors: string
}

// ----------------------------

export interface IWebServer {
    port: string,
    displayNodeProcess: string,
    host: string
}

// ----------------------------

export interface IMail {
    host: string,
    port: string,
    user: string,
    passsword: string
}

// --------------------------------------------------------------------

// Basic configuration control ------------------------------------

export const DEV: string    = "DEV"       // NODE_ENV (shell) 
export const MONGO: string  = "MONGO"     // DB_TYPE
export const MYSQL: string  = "MYSQL"     // DB_TYPE
export const TRUE: string   = "true"      // displayNodeProcess
export const FALSE: string  = "false"     // displayNodeProcess

