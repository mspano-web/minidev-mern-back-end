/* postman.sql */
/* -------------------------------------------------------------------- */

/*
     This script contains json to test the various minidev APIs from POSTMAN.
     Requires having initialized the parametric tables / documents.
*/


/* Users ------------------------------------------------------------- */
/*      Method:  POST (insert) - http://localhost:5000/users/register   */
/*      Body:                                                          */

{
    "_id":                1,
    "usr_name":           "Administrator",
    "usr_email":          "adm@minidev.com",
    "usr_street_address": "MiniDev admin address",
    "state_id":           1,
    "city_id":            1,
    "usr_zip":            "ZZZ",
    "usr_phone_number":   "(999) 999-9999",
    "usr_username":       "admin",
    "usr_password":       "admin",
    "rol_id":             1
}

{
    "_id":                2,
    "usr_name":           "Usuario Standard",
    "usr_email":          "standard@minidev.com",
    "usr_street_address": "User address",
    "state_id":           1,
    "city_id":            1,
    "usr_zip":            "ZZZ",
    "usr_phone_number":   "(888) 888-8888",
    "usr_username":       "standard",
    "usr_password":       "standard",
    "rol_id":             2
}

/* Users ------------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/users/              */
/*      Body:                                                          */

/* Users ------------------------------------------------------------- */
/*      Method:  POST (read) - http://localhost:5000/users/login        */
/*      Body:                                                          */

{
    "usr_email":          "standard@minidev.com",
    "usr_password":       "standard"
}

/* Users ------------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/users/2             */
/*      Body:                                                          */
/*      Header:                                                       */
HEADER: x-access-token: "[Token returned in / users / login]"
HEADER: x-security-role   STANDARD


/* Users ------------------------------------------------------------- */
/*      Method:  PUT (update) - http://localhost:5000/users/2           */
/*      Body:                                                          */

{
    "_id":                2,
    "usr_name":           "Usuario Standard Modificado",
    "usr_email":          "standard_modificado@gmail.com",
    "usr_street_address": "User address modificado",
    "state_id":           1,
    "city_id":            1,
    "usr_zip":            "XXX",
    "usr_phone_number":   "(111) 111-1111",
    "usr_username":       "standard_modificado",
    "usr_password":       "standard_modificado",
    "rol_id":             2
}
/*      Header:                                                        */
HEADER: x-access-token: "[Token returned in /users/login]"
HEADER: x-security-role   STANDARD

/* Users ------------------------------------------------------------------- */
/*      Method:  POST (update) - http://localhost:5000/users/forgotpassword  */      
/*      Body:                                                                */
{
    "email":  "standard@minidev.com"
}

/* Users ------------------------------------------------------------------- */
/*      Method:  PUT (update) - http://localhost:5000/users/resetpassword/2  */         
/*      Body:                                                                */
{
    "newPassword": "standard_modificado_reset",
    "token": "[Token sent by email / link]"
}

/* Contact ------------------------------------------------------------- */
/*      Method:  POST (insert) - http://localhost:5000/contacts          */
/*      Body:                                                          */
{
    "cont_name":  "Usuario Contacto",
    "cont_email":  "ucontact@gmailcom",
    "cont_comments": "Comentarios y consultas",
    "cont_date": "01-01-1999"
}
/*      Header:                                                        */

/* States ------------------------------------------------------------ */
/*      Method:  GET (read) - http://localhost:5000/states/             */
/*      Body:                                                          */
/*      Header:                                                        */


/* Categories -------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/categories/        */
/*      Body:                                                          */
/*      Header:                                                        */


/* Configurations ---------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/configuration/     */
/*      Body:                                                          */
/*      Header:                                                        */

/* Products ---------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/products/          */
/*      Body:                                                          */
/*      Header:                                                        */

/* Products ---------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/products/1         */
/*      Body:                                                          */
/*      Header:                                                        */


/* Publications--------------------------------------------------------- */
/*      Method:  POST (insert) - http://localhost:5000/publications      */
/*      Body:                                                          */
{
    "pub_title":  "Classic jean shorts",
    "pub_description": "Excellent summer shorts for all occasions.",
    "pub_price": 20,
    "pub_shipping_cost": 0,
    "pub_due_date": "01-10-2022",
    "category": 
    {
        "_id" : 3,
        "cat_flag_single" : true,
        "cat_description": "Shorts"    
    },
    "products": [
        {
            "_id": 5,
            "prod_title": "Classic jean shorts",
            "prod_description": "Excellent summer shorts for all occasions.",
            "prod_price": 20,
            "category": 
            {
                "_id" : 3,
                "cat_flag_single" : true,
                "cat_description": "Shorts"    
            },
            "images": [
                {
                 "_id": 1,
                 "img_flag_main": true,
                 "img_filename": "1_1",
                 "img_extension": "jpg"
                },
                {
                 "_id": 2,
                 "img_flag_main": false,
                 "img_filename": "1_2",
                 "img_extension": "jpg"
                },
                {
                 "_id": 3,
                 "img_flag_main": false,
                 "img_filename": "1_3",
                 "img_extension": "jpg"
                },
                {
                 "_id": 4,
                 "img_flag_main": false,
                 "img_filename": "1_4",
                 "img_extension": "jpg"
                },
                {
                 "_id": 5,
                 "img_flag_main": false,
                 "img_filename": "1_5",
                 "img_extension": "jpg"
                }
             ]
        }
    ]
 }
/*      Header:                                                        */
HEADER: x-access-token: "[Token returned in /users/login]"
HEADER: x-security-role   ADMIN

/* Publications --------------------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/publications?page=1&limit=3       */
/*      Body:                                                                         */
/*      Header:                                                                       */


/* Publications ----------------------------------------------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/publications/title?title=Classic jean shorts&page=1&limit=3 */
/*      Body:                                                                                                   */
/*      Header:                                                                                                 */

/* Publications-------------------------------------------------------------- */
/*      Method:  GET (read) - http://localhost:5000/publications/category/3?page=1&limit=3   */
/*      Body:                                                                                */
/*      Header:                                                                              */

/* Publications------------------------------------------------------ */
/*      Method:  GET (read) - http://localhost:5000/publications/77    */
/*      Body:                                                         */
/*      Header:                                                       */


/* Sales ------------------------------------------------------------- */
/*      Method:  POST (insert) - http://localhost:5000/sales           */
/*      Header:                                                       */
HEADER: x-access-token: [Token returned in /users/login]
HEADER: x-security-role   STANDARD
/*      Body:                                                          */
 {
    "pub_id": "76",
    "usr_id": "2",
    "sale_delivery_date": "2022-3-2 10:31:4",
    "sale_invoice_amount": 22,
    "user": '2'
}

/* -------------------------------------------------------------------- */
