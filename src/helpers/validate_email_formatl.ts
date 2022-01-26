/**
 * validate_email_format.ts : Use the npm email-validator package to validate an email address
 */

import * as EmailValidator from 'email-validator';

/**
 * Function that validates an email address
 * 
 * @param email email to validate
 * @returns     true (validated email) or false
 */

export const emailCheckFormat = (email: string): boolean => {
    return EmailValidator.validate(email);
} 

// ---------------------------------------------------
