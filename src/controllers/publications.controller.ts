/**
 *  publications.controller.ts
 */

import { Request, Response, NextFunction } from "express";
const PublicationService = require("../services/publications.service");
const { StandardError } = require('../errors/errors');
import { IPageOptions } from "../types/page_options.type"

/**
 * Controlling function, processes a request to obtain the information of a particular publication by invoking the corresponding service 
 *    and returns the response with the requested information.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getPublication = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const pageOptions: IPageOptions = {
      page : (req.query.page)?parseInt(req.query.page as string):1,
      limit: (req.query.limit)? parseInt(req.query.limit as string): 1,
    }
    if (!id) throw new StandardError({message: "Get Publication without data", data: {id: id}})
    const publication = await PublicationService.getPublication(id, pageOptions);
    return res.status(200).json(publication);
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controlling function, processes a request to obtain the information from the current publications, 
 *    considering the paging provided by the client, 
 *    by invoking the corresponding service and returns the response with the requested information.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getPublications = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const pageOptions: IPageOptions = {
      page : (req.query.page)?parseInt(req.query.page as string):0,
      limit: (req.query.limit)? parseInt(req.query.limit as string): 10,
    }
  
    const publications = await PublicationService.getPublications(pageOptions);
    return res.status(200).json( publications );
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controlling function, processes a request to get the total number of posts,
 *    by invoking the corresponding service and returns the response with the requested information.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const getPublicationsTotal = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const countPublications: number = await PublicationService.getPublicationsTotal();
    return res.status(200).json( countPublications );
  } catch (e: any) {
    next(e)
  }
};


/**
 * Controlling function, processes a request to obtain the information from the current publications associated with a certain category, 
 *   considering the paging provided by the client, 
 *   by invoking the corresponding service and returns the response with the requested information.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
export const getPublicationsbyCategory = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const pageOptions: IPageOptions = {
      page : (req.query.page)?parseInt(req.query.page as string):0,
      limit: (req.query.limit)? parseInt(req.query.limit as string): 10,
    }

    const category_id = req.params.id;
    if (!category_id) throw new StandardError({message: "Get Publication without data", data: {category_id: category_id}})
    const publications = await PublicationService.getPublicationsbyCategory(category_id, pageOptions);
    return res.status(200).json( publications );
  } catch (e: any) {
    next(e)
  }
};


export const getPublicationsbyCategoryTotal = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const category_id = req.params.id;
    if (!category_id) throw new StandardError({message: "Get Publication without data", data: {category_id: category_id}})
    const countPublications: number = await PublicationService.getPublicationsbyCategoryTotal(category_id);
    return res.status(200).json( countPublications );
  } catch (e: any) {
    next(e)
  }
};


// It would be convenient to use pagination in this service
/**
 * Controlling function, processes a request to obtain the information of the current publications associated with a certain search, 
 *   without considering paging, 
 *   by invoking the corresponding service and returns the response with the requested information.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const getPublicationsbyTitle = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const title = req.query.title;
    const pageOptions: IPageOptions = {
      page : (req.query.page)?parseInt(req.query.page as string):0,
      limit: (req.query.limit)? parseInt(req.query.limit as string): 10,
    }

    if (!title) throw new StandardError({message: "Get Publication without data", data: {title: title}})
    const publications = await PublicationService.getPublicationsbyTitle(title, pageOptions);
    return res.status(200).json(publications);
  } catch (e: any) {
    next(e)
  }
};

export const getPublicationsbyTitleTotal = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const title = req.query.title;
    if (!title) throw new StandardError({message: "Get Publication Count without data", data: {title: title}})
    const countPublications: number = await PublicationService.getPublicationsbyTitleTotal(title);
    return res.status(200).json( countPublications );
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controlling function, processes a request to create a new publication from the data provided by the client, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const createPublication = async function (req: Request,res: Response,next: NextFunction) {
  try {
    const publication = req.body;
    if (!publication) throw new StandardError({message: "Create Publication without data", data: {publication: publication}})
    return res
      .status(200)
      .json(await PublicationService.createPublication(publication));
  } catch (e: any) {
    next(e)
  }
};

/**
 * Controlling function, processes a request to modify an existing publication from the data provided by the client, 
 *    invoking the corresponding service and returning the result of the processing.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
 export const updatePublication = async function (req: Request,res: Response,next: NextFunction) {
  try {
    const publication_id = req.params.id;
    const oPublication = req.body;
    if (!publication_id || !oPublication) throw new StandardError({message: "Create Publication without data", data: {publication_id: publication_id, oPublication: oPublication }})
    const publication = await PublicationService.updatePublication(publication_id, oPublication);
    return res.status(200).json({ data: publication });
  } catch (e: any) {
    next(e)
  }
};

// --------------------------------------------------------------------
