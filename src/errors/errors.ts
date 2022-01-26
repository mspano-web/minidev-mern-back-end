/**
 * errors.ts : This file contains the declaration of custom error classes.
 */

import { IStandardError, IInternalError } from "../types/errors.type"


/**
 *  Class used for standard errors of the application.
 */
class StandardError extends Error { 
    private _iError: IStandardError = {name: "", route: "", params: {}, exception: "", message: "", statusCode: 0, dateTime: new Date().toLocaleString()}

    constructor( iError: any) {
      super();
      this._iError.name = this.constructor.name // Good practice!
      this._iError.route =  iError.route
      this._iError.params = iError.params
      this._iError.exception = iError.exception
      this._iError.statusCode = iError.statusCode || 400
      this._iError.message = iError.message

      // Keeps a proper stack trace for where our bug was thrown (only available in V8)
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, StandardError)
        }
      }
  }

 /**
  *  Class used for internal errors of the system.
  */
 class InternalError extends Error { 
    private _iError: IInternalError = {name: "", exception: "", message: "", statusCode: 500, dateTime: new Date().toLocaleString(), data: {}}

    constructor( iError: any) {
      super();
      this._iError.name = this.constructor.name // Good practice!
      this._iError.exception = iError.exception
      this._iError.message = iError.message
      this._iError.data = iError.data
    }
  }

 // -----------------------------

module.exports = {
    StandardError,
    InternalError
}

// ----------------------------------------------------------------------
