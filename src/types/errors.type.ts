// errors.type.ts
// -----------------------------------------------------------

export interface IStandardError {
    name:string
    route: string
    params?: any
    exception: string
    message: string
    statusCode: number
    dateTime: string
  }

  // ------------------------------

  export interface IInternalError {
    name:string
    exception: string
    message: string
    statusCode: number
    dateTime: string
    data: any
  }

  // -----------------------------------------------------------
   