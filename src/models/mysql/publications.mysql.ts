/**
 * publications.mysql.ts
 */

import { IPublicationProductCategoryImage }  from "../../types/publication-product-category-image.type"
import { GenericServicesMySQL } from "./generic.mysql";
import { IPublication } from "../../types/publication.type"
import { publicationFindFilters } from "../../types/search.types"
import {format} from 'mysql2'
const { InternalError, StandardError } = require('../../errors/errors');
import { IPageOptions } from "../../types/page_options.type"

/**
 * Class with access functions to the MySQL model, publications table.
 */

export class PublicationsMySQL {

    // -------------------------------------------------------------

    /**
     * Function that performs the recovery of all the publications registered in the application, 
     *     taking as a parameter a pagination provided by the client that makes the request.
     * 
     * @param pO    Paging parameters.
     * @returns     Returns the data of the publications, with the information of their products, categories and associated images.
     */
    static async find(pO: IPageOptions): Promise<Array<IPublicationProductCategoryImage>> {
        let gS = new GenericServicesMySQL<IPublicationProductCategoryImage>();

        const query: string = `SELECT p._id AS publication_id, 
                                      pr._id AS product_id, 
                                      p.cat_id AS category_id, 
                                      i._id  AS image_id, 
                                      p.pub_title, 
                                      p.pub_description, 
                                      p.pub_price, 
                                      p.pub_shipping_cost, 
                                      p.pub_due_date, 
                                      p.pub_create_date, 
                                      cat.cat_flag_single AS pub_cat_flag_single, 
                                      cat.cat_description AS pub_cat_description, 
                                      pr.prod_title, 
                                      pr.prod_description, 
                                      pr.prod_price, 
                                      c.cat_flag_single AS prod_cat_flag_single, 
                                      c.cat_description AS prod_cat_description, 
                                      i.img_flag_main,  
                                      i.img_filename, 
                                      i.img_extension FROM publications AS p 
                                    JOIN publish_products AS pp on (p._id=pp.pub_id) 
                                    JOIN products AS pr on (pr._id=pp.prod_id) 
                                    LEFT JOIN categories AS cat ON cat._id = p.cat_id 
                                    LEFT JOIN categories AS c ON c._id = pr.cat_id 
                                    LEFT JOIN images as i ON i.prod_id = pr._id 
                                  WHERE p._id IN (
                                      select * from ( 
                                          SELECT _id FROM publications 
                                          WHERE  pub_due_date > CURDATE() 
                                            ORDER BY pub_create_date DESC 
                                            LIMIT ${pO.limit} 
                                            OFFSET ${(pO.page -1) * pO.limit} 
                                      ) AS subquery 
                                    );`
        // Outer join
        let results: Array<IPublicationProductCategoryImage> = await gS.find(query);
        return results;
    }


    static async count(): Promise<number> {
      let gS = new GenericServicesMySQL<IPublicationProductCategoryImage>();

      const query: string = `SELECT COUNT(*) AS TOTAL FROM publications WHERE  pub_due_date > CURDATE()`
      let results: number = await gS.count(query);
      return results;
  }


  static async countSome(clv: publicationFindFilters, valueSearch: string): Promise<number> {
    let gS = new GenericServicesMySQL<IPublicationProductCategoryImage>();

    const query: string = `SELECT COUNT(*) AS TOTAL FROM publications WHERE ${clv} = ${valueSearch}  AND pub_due_date > CURDATE()`
    let results: number = await gS.count(query);
    return results;
  }
    /**
     * Function that performs the retrieval of all the publications registered in the application that meet a search criteria, does not use pagination.
     * 
     * @param clv           Field to be used as a key in the "query" that performs the publication search.
     * @param valueSearch   Value to search (example: title)
     * @returns             Returns the data of the publications, with the information of their products, categories and associated images.
     */
    static async findSomeLike(clv: publicationFindFilters, valueSearch: string, pO: IPageOptions): Promise<Array<IPublicationProductCategoryImage>> {
          let gS = new GenericServicesMySQL<IPublicationProductCategoryImage>();
    
          if (!valueSearch || !clv) throw new InternalError({message: "Get Publications Fail", data: {valueSearch: valueSearch, clv: clv }})
          // Outer join
          const query = `SELECT p._id AS publication_id, 
                                pr._id AS product_id, 
                                p.cat_id AS category_id, 
                                i._id  AS image_id, 
                                p.pub_title, 
                                p.pub_description, 
                                p.pub_price, 
                                p.pub_shipping_cost, 
                                p.pub_due_date, 
                                p.pub_create_date, 
                                cat.cat_flag_single AS pub_cat_flag_single, 
                                cat.cat_description AS pub_cat_description, 
                                pr.prod_title, 
                                pr.prod_description, 
                                pr.prod_price, 
                                c.cat_flag_single AS prod_cat_flag_single, 
                                c.cat_description AS prod_cat_description, 
                                i.img_flag_main,  i.img_filename, 
                                i.img_extension 
                            FROM publications AS p 
                              JOIN publish_products AS pp on (p._id=pp.pub_id) 
                              JOIN products AS pr on (pr._id=pp.prod_id) 
                              LEFT JOIN categories AS cat ON cat._id = p.cat_id 
                              LEFT JOIN categories AS c ON c._id = pr.cat_id 
                              LEFT JOIN images as i ON i.prod_id = pr._id 
                           WHERE p._id IN (
                                select * from (
                                    SELECT _id FROM publications
                                    WHERE ${clv} LIKE '%${valueSearch}%' 
                                    AND pub_due_date > CURDATE()
                                      ORDER BY pub_create_date DESC
                                      LIMIT ${pO.limit} 
                                      OFFSET ${(pO.page -1) * pO.limit} 
                                   ) AS subquery
                              )`  
          let results: Array<IPublicationProductCategoryImage>  = await gS.find(query)
          return results;
      }

     
  static async countLike(clv: publicationFindFilters, valueSearch: string): Promise<number> {
    let gS = new GenericServicesMySQL<IPublicationProductCategoryImage>();

    const query: string = `SELECT COUNT(*) AS TOTAL FROM publications WHERE ${clv} LIKE '%${valueSearch}%'   AND pub_due_date > CURDATE()`
    let results: number = await gS.count(query);
    return results;
  }
    
    /**
     * Function that performs the retrieval of a particular publication registered in the application that meets a search criteria.
     * 
     * @param clv           Field to be used as a key in the "query" that performs the publication search.
     * @param valueSearch   Value to search (example: ID)
     * @returns             Returns the data of the publication, with the information of its products, categories and associated images.
     */
    static async findSomeExact(clv: publicationFindFilters, valueSearch: string, pO: IPageOptions): Promise<Array<IPublicationProductCategoryImage>> {
          let gS = new GenericServicesMySQL<IPublicationProductCategoryImage>();
    
          if (!valueSearch || !clv) throw new InternalError({message: "Get Publications Fail", data: {valueSearch: valueSearch, clv: clv }})
          // Outer join
          const query = `SELECT p._id AS publication_id, 
                                pr._id AS product_id, 
                                p.cat_id AS category_id, 
                                i._id  AS image_id, 
                                p.pub_title, 
                                p.pub_description, 
                                p.pub_price, 
                                p.pub_shipping_cost,  
                                p.pub_due_date, 
                                p.pub_create_date, 
                                cat.cat_flag_single AS pub_cat_flag_single, 
                                cat.cat_description AS pub_cat_description, 
                                pr.prod_title, 
                                pr.prod_description, 
                                pr.prod_price, 
                                c.cat_flag_single AS prod_cat_flag_single, 
                                c.cat_description AS prod_cat_description, 
                                i.img_flag_main,  
                                i.img_filename, 
                                i.img_extension 
                            FROM publications AS p 
                              JOIN publish_products AS pp on (p._id=pp.pub_id) 
                              JOIN products AS pr on (pr._id=pp.prod_id) 
                              LEFT JOIN categories AS cat ON cat._id = p.cat_id 
                              LEFT JOIN categories AS c ON c._id = pr.cat_id 
                              LEFT JOIN images as i ON i.prod_id = pr._id 
                            WHERE p._id IN (
                              select * from (
                                  SELECT _id FROM publications
                                  WHERE ${clv} = ?
                                  AND pub_due_date > CURDATE()
                                    ORDER BY pub_create_date DESC
                                    LIMIT ${pO.limit} 
                                    OFFSET ${(pO.page -1) * pO.limit} 
                                ) AS subquery
                            )`;
          
          let results: Array<IPublicationProductCategoryImage> = await gS.findSome(query, valueSearch)
     
          return results;
      }
    
    /**
     * Function that performs the registration of a publication associating it with its corresponding products in the database.
     * 
     * @param p   Data of the publication to be registered.
     * @returns   Returns the new ID of the publication created.
     */
     static async create(p: IPublication): Promise<number> {
        let newId: number = 0
        let gS = new GenericServicesMySQL<IPublication>();
        try {
            if (!p) throw new InternalError({message: "Create Publications Fail", data: {publication: p}})
            await gS.beginTransaction()

             let insertQuery = 'INSERT INTO publications (pub_title, pub_description, cat_id, pub_price, pub_shipping_cost, pub_due_date) VALUES (?, ?, ?, ?, ?, ?)';
             let query = format(insertQuery,[p.pub_title, p.pub_description, p.category._id, p.pub_price, p.pub_shipping_cost, p.pub_due_date]) 
             newId = await gS.create(query) // Wait for the Promise to be resolved
             p.products.forEach(async  (element) => {
                insertQuery = 'INSERT INTO publish_products (pub_id, prod_id) VALUES (?, ?)';
                query = format(insertQuery,[newId, element._id]) 
                await gS.create(query)  // Wait for the Promise to be resolved
              });
            await gS.commitTransaction()
         } catch (e) {
             await gS.rollbackTransaction()
             if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
             else {  throw new InternalError({message: "Create Publication Fail", data: {publication:p}, exception: e}) }      
         }
        return newId;  // Transform to the return type Promise <number>
    }

    /**
     * Function that updates the data of a publication in the database. 
     * 
     * @param p       Publication data.
     * @param id      Publication ID.
     * @returns       Returns true if the operation was successful and false otherwise.
     */
    static async updateOne(p: IPublication, id: string): Promise<boolean> {
      let  resultUpdate: boolean = false
      let  resultDelete: boolean = false
      let  resultInsert: number = 0
      let gS = new GenericServicesMySQL<IPublication>();

      try {
  
        if (!p || !id) throw new InternalError({message: "Update Publications Fail", data: {publication: p, id: id}})

          await gS.beginTransaction()
          const updateQuery = 'UPDATE publications SET pub_title = ?, pub_description = ?, cat_id = ?, pub_price = ?, pub_shipping_cost = ?, pub_due_date = ? WHERE _id = ?';
          let query = format(updateQuery,[p.pub_title, p.pub_description, p.category._id, p.pub_price, p.pub_shipping_cost, p.pub_due_date, parseInt(id)]) 
          resultUpdate = await gS.updateOne(query)

          const deletetQuery = `DELETE FROM publish_products WHERE ${publicationFindFilters.PublicationProduct} = ?`;
          resultDelete = await gS.deleteSome(deletetQuery, id)
          if (resultDelete) resultUpdate = true // Any change made in the base returns true

          const insertQuery = 'INSERT INTO publish_products (pub_id, prod_id) VALUES (?, ?)';
          p.products.forEach(async  (element) => {
            query = format(insertQuery,[id, element._id]) 
            resultInsert = await gS.create(query)  // Wait for the Promise to be resolved
            if (resultInsert) resultUpdate = true // Any change made in the base returns true
          });
         await gS.commitTransaction()
      } catch (e) { 
         await gS.rollbackTransaction()
        if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
        else {  throw new InternalError({message: "Update Publication Fail", data: {publication: p, id: id}, exception: e}) }      

      }
      return resultUpdate;
    }

}

// -------------------------------------------------------------
