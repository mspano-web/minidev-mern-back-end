/**
 * encrypt.ts
 */

const bcrypy = require("bcrypt");

/* 
  bcrypt : is used to hash user passwords or other sensitive information we don’t want to
           plainly store in our database.
*/

/**
 * Function that allows validating if two keys received are identical.
 * 
 * @param password      User Password 1
 * @param usr_password  User Password 2
 * @returns Returns the result of the comparison: true or false.
 */
export const verifyPassword = function (password: string, usr_password: string): boolean {
     return bcrypy.compareSync(password, usr_password);
 };

 
/**
 * Function that allows encryption of the user password received.
 * 
 * @param password  User Password
 * @returns   Returns the encrypted key
 */
export const encryptPassword = async (password: string) => {
    const salt = await bcrypy.genSalt(10);
    return bcrypy.hash(password, salt);
};

// ------------------------------------------------------------
