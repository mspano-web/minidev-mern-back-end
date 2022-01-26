/* mongodb-create-initial-state.sql
/* -------------------------------------------------------------------- */

/*
   Script - The objective of this script is to define the content to be inserted in some collections 
   to be used in the minidev application, content that in the context of this exercise would be maintained 
   by another application.  
*/

use mern-minidev-ts

/* categories -------------------------------------------------------------------- */

/* _id: It is inserted as a string since it is the data type declared in the model. */

db.categories.insertMany(
[
    {
        "_id" : "1",   
        "cat_flag_single" : true,
        "cat_description": "Underwear"
    },
    {
        "_id" : "2",
        "cat_flag_single" : true,
        "cat_description": "Dress"
    },
    {
        "_id" : "3",
        "cat_flag_single" : true,
        "cat_description": "Shorts"
    },
    {
        "_id" : "4",
        "cat_flag_single" : true,
        "cat_description": "Skirt"
    },
    {
        "_id" : "5",
        "cat_flag_single" : true,
        "cat_description": "Pants "
    },
    {
        "_id" : "6",
        "cat_flag_single" : true,
        "cat_description": "T-Shirt "
    }
]
);

/* roles -------------------------------------------------------------------- */

db.roles.insertMany(
[
    {
        "_id" : "1",
        "rol_name" : "ADMIN"
    },
    {
        "_id" : "2",
        "rol_name" : "STANDARD"
    }
]
);

/* configurations -------------------------------------------------------------------- */

db.configurations.insertOne(
{
    "conf_delivery_time_from" : 8,
    "conf_delivery_time_to"   : 17,
    "conf_path_image_prod": "/images/",
    "conf_name_image_prod_default": "default-image-product",
}
)

/* states  -------------------------------------------------------------------- */

db.states.insertMany(
[
        {
            "_id" : "1",
            "state_description" : "Florida",
            "cities" : [
                {
                    "_id" : "1",
                    "city_description": "Miami",
                    "city_delivery_days": 1,
                    "city_shipping_cost": 3            
                },
                {
                    "_id" : "2",
                    "city_description": "Orlando",
                    "city_delivery_days": 1,
                    "city_shipping_cost": 4            
                },
                {
                    "_id" : "3",
                    "city_description": "Jacksonville",
                    "city_delivery_days": 1,
                    "city_shipping_cost": 4            
                },
                {
                    "_id" : "4",
                    "city_description": "Tampa",
                    "city_delivery_days": 1,
                    "city_shipping_cost": 4            
                },
                {
                    "_id" : "5",
                    "city_description": "San Peterburgo",
                    "city_delivery_days": 1,
                    "city_shipping_cost": 4            
                },
                {
                    "_id" : "6",
                    "city_description": "Hialeah",
                    "city_delivery_days": 1,
                    "city_shipping_cost": 4            
                },
            ],
        },
        {
            "_id" : "2",
            "state_description" : "Georgia",
            "cities" : [
                {
                    "_id" : "7",
                    "city_description": "Atlanta",
                    "city_delivery_days": 2,
                    "city_shipping_cost": 5            
                },
                {
                    "_id" : "8",
                    "city_description": "Augusta",
                    "city_delivery_days": 2,
                    "city_shipping_cost": 5            
                },
                {
                    "_id" : "9",
                    "city_description": "Columbus",
                    "city_delivery_days": 2,
                    "city_shipping_cost": 5            
                },
                {
                    "_id" : "10",
                    "city_description": "Savannah",
                    "city_delivery_days": 2,
                    "city_shipping_cost": 5            
                }
            ],
        },
        {
            "_id" : "3",
            "state_description" : "South Carolina",
            "cities" : [
                {
                    "_id" : "11",
                    "city_description": "Charleston",
                    "city_delivery_days": 3,
                    "city_shipping_cost": 8            
                },
                {
                    "_id" : "12",
                    "city_description": "Columbia",
                    "city_delivery_days": 3,
                    "city_shipping_cost": 8            
                },
                {
                    "_id" : "13",
                    "city_description": "Florence",
                    "city_delivery_days": 3,
                    "city_shipping_cost": 8            
                }
            ],
        }
    ]
);

/* products  -------------------------------------------------------------------- */

db.products.insertMany(
    [
        {
        "_id" : "1",
        "prod_title" : "Classic jean shorts", 
        "prod_description" : "Excellent summer shorts for all occasions.",
        "prod_price" : 20.15,

        "categories" : {
            "_id" : 3,
            "cat_flag_single" : true,
            "cat_description": "Shorts"
        },
        "images" : []
    },
    {
        "_id" : "2",
        "prod_title" : "Classic panties", 
        "prod_description" : "Black panties with delicate lace details.",
        "prod_price" : 45,

        "categories" : {
            "_id" : 1,
            "cat_flag_single" : true,
            "cat_description": "Underwear"
        },
        "images" : [ ]
    },
    {
        "_id" : "3",
        "prod_title" : "Greek dress", 
        "prod_description" : "Light beige designer dress with open neckline. Ideal for walks in spring afternoons.",
        "prod_price" : 80.80,

        "categories" : {
            "_id" : 2,
            "cat_flag_single" : true,
            "cat_description": "Dress"
        },
        "images" : []
    },
    {
        "_id" : "4",
        "prod_title" : "Red bodice",
        "prod_description" : "Basic bodice of attractive color, very sexy and adjusted to the body.",
        "prod_price" : 30,

        "categories" : {
            "_id" : 1,
            "cat_flag_single" : true,
            "cat_description": "Underwear",
        },
        "images" : []
    },
    {
        "_id" : "5",
        "prod_title" : "Off-road shorts", 
        "prod_description" : "Comfortable shorts for long walks in hot places.",
        "prod_price" : 25,

        "categories" : {
            "_id" : 3,
            "cat_flag_single" : true,
            "cat_description": "Shorts"
        },
        "images" : []
    },
    {
        "_id" : "6",
        "prod_title" : "Ripped jean pants", 
        "prod_description" : "Season launch 2022. New design, ideal to accompany you in your daily activities.",
        "prod_price" : 45,

        "categories" : {
            "_id" : 5,
            "cat_flag_single" : true,
            "cat_description": "Pants"
        },
        "images" : []
    },
    {
        "_id" : "7",
        "prod_title" : "Workout pants", 
        "prod_description" : "Special pants for all kinds of physical activity. Stretch fabric, adapts to your body. Maintains body heat improving your performance.",
        "prod_price" : 30.80,

        "categories" : {
            "_id" : 5,
            "cat_flag_single" : true,
            "cat_description": "Pants"
        },
        "images" : []
    },
    {
        "_id" : "8",
        "prod_title" : "Woven Mini Skirt", 
        "prod_description" : "Mini skirt / Side slit / Invisible zipper / Composition: Elastane 10%, Cotton 90%.",
        "prod_price" : 29,

        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "9",
        "prod_title" : "Eternal short", 
        "prod_description" : "A special short to wear in all your daily activities. Made of top quality materials that guarantee a long life of use.",
        "prod_price" : 23,

        "categories" : {
            "_id" : 3,
            "cat_flag_single" : true,
            "cat_description": "Shorts"
        },
        "images" : []
    },
    {
        "_id" : "10",
        "prod_title" : "Casual pants", 
        "prod_description" : "Super light colored casual pants. For the young and active woman of today.",
        "prod_price" : 50,

        "categories" : {
            "_id" : 5,
            "cat_flag_single" : true,
            "cat_description": "Pants"
        },
        "images" : []
    },
    {
        "_id" : "11",
        "prod_title" : "Black mini panties", 
        "prod_description" : "Sensual and attractive. To expose all your physical attractiveness in your most reserved moments.",
        "prod_price" : 26,

        "categories" : {
            "_id" : 1,
            "cat_flag_single" : true,
            "cat_description": "Underwear"
        },
        "images" : []
    },
    {
        "_id" : "12",
        "prod_title" : "Black mini short panther collection", 
        "prod_description" : "For active women, practical and tight mini shorts. It adapts perfectly to any silhouette.",
        "prod_price" : 25,

        "categories" : {
            "_id" : 3,
            "cat_flag_single" : true,
            "cat_description": "Shorts"
        },
        "images" : []
    },
    {
        "_id" : "13",
        "prod_title" : "Freestyle short", 
        "prod_description" : "Fun model, ideal for young dynamics.",
        "prod_price" : 18,

        "categories" : {
            "_id" : 3,
            "cat_flag_single" : true,
            "cat_description": "Shorts"
        },
        "images" : []
    },
    {
        "_id" : "14",
        "prod_title" : "Designer shorts", 
        "prod_description" : "New collection of clothing season 2022. Spring colors, cheerful, light clothing. It combines with any shirt or top.",
        "prod_price" : 30,

        "categories" : {
            "_id" : 3,
            "cat_flag_single" : true,
            "cat_description": "Shorts"
        },
        "images" : []
    },
    {
        "_id" : "15",
        "prod_title" : "Flared skirt", 
        "prod_description" : "Feel free, enjoy a fun skirt, joyfully live every moment of your life.",
        "prod_price" : 22.6,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "16",
        "prod_title" : "Executive skirt", 
        "prod_description" : "Enjoy our exclusive executive collection. For sensual, business women.",
        "prod_price" : 45,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "17",
        "prod_title" : "Student skirt", 
        "prod_description" : "Modern and attractive skirt for female students. Sober and stylish colors.",
        "prod_price" : 30,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "18",
        "prod_title" : "Skirt for parties", 
        "prod_description" : "Enjoy your meetings with friends, your parties with this fabulous skirt.",
        "prod_price" : 21.12,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "19",
        "prod_title" : "Scottish skirt", 
        "prod_description" : "Daring, sensual, charismatic. For modern women who like to show off their body.",
        "prod_price" : 30,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "20",
        "prod_title" : "Caribbean style skirt", 
        "prod_description" : "Dazzle with this great copper colored skirt that combines in an incredible way with your Caribbean skin color.",
        "prod_price" : 30,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "21",
        "prod_title" : "Skirt young collection 2022", 
        "prod_description" : "New design. Ideal for disruptive young people, with a lot of personality.",
        "prod_price" : 20,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "22",
        "prod_title" : "Training skirt", 
        "prod_description" : "To accompany you in your sports routine. Comfortable, safe, elastic. Various colors.",
        "prod_price" : 19,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "23",
        "prod_title" : "Elegant skirt", 
        "prod_description" : "To show off in the special moments of your life. Unique, distinguished, attractive.",
        "prod_price" : 35,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "24",
        "prod_title" : "Long skirt", 
        "prod_description" : "Stretch long white skirt. It will make you look cool and modern.",
        "prod_price" : 27,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "25",
        "prod_title" : "Ghost skirt", 
        "prod_description" : "Skirt to wear on unique occasions.",
        "prod_price" : 15,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    },
    {
        "_id" : "26",
        "prod_title" : "Piaget skirt", 
        "prod_description" : "Mini skirt to look incredible, professional, fun. Find it in a variety of colors and textures.",
        "prod_price" : 30,
        "categories" : {
            "_id" : 4,
            "cat_flag_single" : true,
            "cat_description": "Skirts"
        },
        "images" : []
    }
]
);

/* ------------------------------------------------------- */


