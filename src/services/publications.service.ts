/**
 * publications.service.ts
 */
import { PublicationModel } from "../models/mongo/publications.model";
import { IPublication } from "../types/publication.type"
const Configuration = require("../config/config");
import { MONGO } from "../types/config.types"
import { PublicationsMySQL } from "../models/mysql/publications.mysql"
import { joinPublicationsToObject, joinPublicationToObject } from "../helpers/joinMySQLtoObject"
import { publicationFindFilters } from "../types/search.types"
const { StandardError, InternalError } = require('../errors/errors');
import { IPageOptions } from "../types/page_options.type"

/**
 * Service function, processes the business case of request to obtain publications, 
 *   based on the pagination provided by the client. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param pO Pagination data to be used as a reference in the publications to be searched. 
 * @returns  Returns the data of the publications found.
 */
export const getPublications = async function (pO: IPageOptions): Promise<Array<IPublication>> {
  let publications: Array<IPublication>;

  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      publications = await PublicationModel.find().where("pub_due_date").gt(Date.now())
                                                  .sort({pub_create_date: 'desc'})
                                                  .limit(pO.limit)
                                                  .skip((pO.page)?(pO.page - 1) * pO.limit:0);
    } else {
        const publicationsProductCategoryImage = await PublicationsMySQL.find(pO); 
        publications = joinPublicationsToObject(publicationsProductCategoryImage)
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Publications Fail", data: {}, exception: e}) }      
  }

  return publications;
};

/**
 * Service function, processes the business case of request to get the total number of posts. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @returns  Returns the total number of registered publications.
 */
 export const getPublicationsTotal = async function (): Promise<number> {
  let countItems: number;

  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
        countItems = await PublicationModel.countDocuments( 
          { 
            pub_due_date:{ $gte: new Date(Date.now()) }
          }
        )
      } else {
        countItems = await PublicationsMySQL.count(); 
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Count Publications Fail", data: {}, exception: e}) }      
  }

  return countItems;
};


/**
 * Service function, processes the business case of request to obtain publications, 
 *   corresponding to a certain category, 
 *   based on the pagination provided by the client. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param category_id  ID of the category to consider.
 * @param pO  Pagination data to be used as a reference in the publications to be searched.
 * @returns Returns the data of the publications found.
 */
export const getPublicationsbyCategory = async function (category_id: string, pO: IPageOptions): Promise<Array<IPublication>> {
     let publications: Array<IPublication> = []

     try {
      if(!category_id) throw new InternalError({message: "Get Publication Fail", data: {category_id: category_id}})
      
      if( Configuration.getInstance().iDatabase.type === MONGO) {
        publications  = await PublicationModel.find().where("category._id").equals(category_id)
                                                       .where("pub_due_date").gt(Date.now())
                                                       .sort({pub_create_date: 'desc'})
                                                       .limit(pO.limit)
                                                       .skip((pO.page)?(pO.page - 1) * pO.limit:0);
      } else {
        const publicationsJoin  = await PublicationsMySQL.findSomeExact(publicationFindFilters.PublicationCategoryId, category_id, pO); 
        if (publicationsJoin !== undefined) publications = joinPublicationsToObject(publicationsJoin)
      }
    } catch (e) {
      if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
      else {  throw new InternalError({message: "Get Publications Fail", data: {category_id: category_id}, exception: e}) }      
    }
  
     return publications;
} 


export const getPublicationsbyCategoryTotal = async function (category_id: string): Promise<number> {
  let countItems: number;

  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
      countItems = await PublicationModel.countDocuments()
      .where("category._id").equals(category_id)
      .where("pub_due_date").gt(Date.now());
      
      } else {
        countItems = await PublicationsMySQL.countSome(publicationFindFilters.PublicationCategoryIdTotal, category_id); 
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Count Publications Fail", data: {}, exception: e}) }      
  }

  return countItems;
};


/**
 * Service function, processes the business case of request to obtain publications, 
 *   corresponding to a certain title, 
 *   without considering the pagination. 
 *   Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param title Title (total or partial) to be used as a reference in the publications to be searched.
 * @returns Returns the data of the publications found.
 */
export const getPublicationsbyTitle = async function (title: string, pO: IPageOptions): Promise<Array<IPublication>> {

  try {
    let publications: Array<IPublication> = []
    if(!title) throw new InternalError({message: "Get Publication Fail", data: {title: title}})
    const search: string = title?.toString().trim();

    if( Configuration.getInstance().iDatabase.type === MONGO) {
      publications = await PublicationModel.find({pub_title: { $regex: search, $options: "i" }})
                                                .where("pub_due_date").gt(Date.now())
                                                .sort({pub_create_date: 'desc'})
                                                .limit(pO.limit)
                                                .skip((pO.page)?(pO.page - 1) * pO.limit:0);
    } else {
      const publicationsJoin  = await PublicationsMySQL.findSomeLike(publicationFindFilters.PublicationTile, search, pO); 
      if (publicationsJoin !== undefined) publications = joinPublicationsToObject(publicationsJoin)
    }
    return publications;
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Publications Fail", data: {title: title}, exception: e}) }      
}
};


export const getPublicationsbyTitleTotal = async function (title: string): Promise<number> {
  let countItems: number;

  try {
    if (Configuration.getInstance().iDatabase.type === MONGO) {
        countItems = await PublicationModel.countDocuments( 
          { 
            pub_title: { $regex: title, $options: "i" },
            pub_due_date:{ $gte: new Date(Date.now()) }
          }
        )
      } else {
        countItems = await PublicationsMySQL.countLike(publicationFindFilters.PublicationTile, title); 
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Count Publications Fail", data: {}, exception: e}) }      
  }

  return countItems;
};


/**
 * Service function, processes the business case of request to obtain a specific publication.
 *    Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param id  ID of the publication to search for.
 * @returns Returns the data of the publication searched.
 */
export const getPublication = async function (id: string, pO: IPageOptions): Promise<IPublication | null> {
  let  publication : IPublication | null 

  try {
    if(!id) throw new InternalError({message: "Get Publication Fail", data: {id: id}})
    if( Configuration.getInstance().iDatabase.type === MONGO) {
      publication = await PublicationModel.findById(id);
    }  else {
      const publicationJoin  = await PublicationsMySQL.findSomeExact(publicationFindFilters.PublicationId, id, pO); 
      publication = joinPublicationToObject(publicationJoin)
    }
  } catch (e) {
    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Get Publication Fail", data: {id: id}, exception: e}) }      
  }
return publication;
};

/**
 * Service function, processes the registration business case of a new publication. 
 *     Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param publication  Data of the new publication to be registered.
 * @returns  ID of the new post registered.
 */
export const createPublication = async function (publication: IPublication): Promise<number> {
  let newId : number = 0

    try {
     if(!publication) throw new InternalError({message: "Get Publication Fail", data: {publication: publication}})

     if ( Configuration.getInstance().iDatabase.type === MONGO) {
       newId = (await PublicationModel.create(publication))._id 
    } else {
       newId = await PublicationsMySQL.create(publication)
    }
  } catch (e) {

    if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
    else {  throw new InternalError({message: "Create Publication Fail", data: {publication: publication}, exception: e}) }      
  }
  return (newId)
};

/**
 * Service function, processes the data modification business case of a specific publication. 
 *     Depending on the database system in use, it invokes the corresponding model handler.
 * 
 * @param publication_id  ID of the publication to update.
 * @param publication  New publication data.
 * @returns Retorna true en caso de exito, o false en caso de fallo.
 */
export const updatePublication = async function (publication_id: string, publication: IPublication): Promise<boolean> {
  let result: boolean = false;
  
  try {
    if(!publication || !publication_id) throw new InternalError({message: "Update Publication Fail", data: {publication_id: publication_id, publication: publication}})
    if( Configuration.getInstance().iDatabase.type === MONGO) {
      await PublicationModel.updateOne(
        { _id: publication_id }, // Filter
        {$set: publication} // Update
      )
        .then((obj) => {
          result = true
        })
        .catch((e) => {
          throw new InternalError({message: "Update Publication Fail", data: {publication_id: publication_id, publication: publication}})
        });
    } else {
      result = await PublicationsMySQL.updateOne(publication, publication_id)
    }
} catch (e) {
  if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
  else {  throw new InternalError({message: "Update Publication Fail", data: {publication_id: publication_id, publication: publication}, exception: e}) }      
}
return result

};

// -----------------------------------------------------------
