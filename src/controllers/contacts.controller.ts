/**
 * contact.controller.ts
 */

import {Request, Response, NextFunction} from "express"
import { IContact } from "../types/contact.type";
const ContactsService = require('../services/contacts.services')    
const { StandardError } = require('../errors/errors');

/**
 * Controlling function, receives a request to create a contact, requests its resolution from the corresponding service and formats and returns the response.
 * 
 * @param req   Request
 * @param res   Response
 * @param next  Next middleware
 * @returns     Goes to the next middleware
 */
    export const createContact  = async function (req: Request, res: Response, next: NextFunction) {

        try {
            const contact : IContact = req.body

            if (!contact) throw new StandardError({message: "Create contact without data", data: {}})
            await ContactsService.createContact(contact)
            return res.status(200).json();
        } catch (e: any) {
            next(e)
        }
    };
    
// --------------------------------------------------------------------


    
