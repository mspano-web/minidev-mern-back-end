/* mysqlcreate-initial-state.sql */
/* -------------------------------------------------------------------------------------------- */

CREATE DATABASE mern_minidev_ts;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';

mysql -u root -p
root

use mern_minidev_ts

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE categories(
    _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cat_flag_single BOOLEAN NOT NULL,
    cat_description VARCHAR(200) NOT NULL
);

/*  Example: add a field that is recorded with the date time in which the record is created.

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
 */

CREATE INDEX categories_cat_description ON categories (cat_description);

DESCRIBE categories;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE roles (
    _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rol_name VARCHAR(50) NOT NULL
);
CREATE INDEX roles_rol_name ON roles (rol_name);

DESCRIBE roles;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE configurations (
    conf_delivery_time_from TINYINT NOT NULL,
    conf_delivery_time_to TINYINT NOT NULL,
    conf_path_image_prod VARCHAR(200) NOT NULL,
    conf_name_image_prod_default VARCHAR(200) NOT NULL
);

DESCRIBE configurations;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE states (
    _id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    state_description VARCHAR(100) NOT NULL
);
CREATE INDEX states_state_description ON states (state_description);

DESCRIBE states;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE cities (
    _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    state_id INT(5) NOT NULL,
    city_description VARCHAR(100) NOT NULL,
    city_shipping_cost DOUBLE,
    city_delivery_days TINYINT NOT NULL
)
ALTER TABLE cities 
  	ADD FOREIGN KEY (state_id) REFERENCES states (_id) ON DELETE CASCADE ON UPDATE CASCADE;

DESCRIBE cities;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE users (
    _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usr_name VARCHAR(50) NOT NULL,
    usr_email VARCHAR(100) NOT NULL,
    usr_street_address VARCHAR(100) NOT NULL,
    state_id INT NOT NULL,
    city_id INT NOT NULL,
    usr_zip VARCHAR(10) NOT NULL,
    usr_phone_number VARCHAR(100) NOT NULL,
    usr_username VARCHAR(50) NOT NULL,
    usr_password VARCHAR(100) NOT NULL,
    rol_id  INT NOT NULL,
);
/* RESTRICT:  if a row from the parent table has a matching row in the child table, MySQL rejects deleting or updating rows in the parent table. */
ALTER TABLE users 
  	ADD FOREIGN KEY (rol_id) REFERENCES roles (_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE users 
  	ADD FOREIGN KEY (state_id) REFERENCES states (_id) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE users 
  	ADD FOREIGN KEY (city_id) REFERENCES cities (_id) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE INDEX users_usr_email    ON users (usr_email);
CREATE INDEX users_usr_username ON users (usr_username);

DESCRIBE users;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE tokens (
    usr_id INT NOT NULL, 
    tok_generated  VARCHAR(100) NOT NULL,
    tok_expiration DATETIME NOT NULL,
    UNIQUE INDEX usr_id (usr_id ASC),
    CONSTRAINT tokens_ibfk_1
       FOREIGN KEY (usr_id)
       REFERENCES users(_id)
       ON DELETE CASCADE
       ON UPDATE CASCADE)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4;

/* CASCADE: if a row from the parent table is deleted or updated, the values of the matching rows in the child table automatically deleted or updated. */
CREATE INDEX tokens_tok_generated ON tokens (tok_generated);

DESCRIBE tokens;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE contacts (
    cont_name VARCHAR(100) NOT NULL,
    cont_email VARCHAR(100) NOT NULL,
    cont_comments TEXT NOT NULL,
    cont_date DATETIME NOT NULL DEFAULT NOW()
);

DESCRIBE contacts;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE products (
    _id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cat_id INT NOT NULL,
    prod_title VARCHAR(100) NOT NULL,
    prod_description TEXT NOT NULL,
    prod_price DOUBLE
);
ALTER TABLE products 
  	ADD FOREIGN KEY (cat_id) REFERENCES categories (_id) ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX products_prod_title ON products (prod_title);

DESCRIBE products;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE images (
    _id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prod_id INT NOT NULL,
    img_flag_main BOOLEAN,
    img_filename VARCHAR(100) NOT NULL,
    img_extension VARCHAR(10) NOT NULL
);
ALTER TABLE images 
  	ADD FOREIGN KEY (prod_id) REFERENCES products (_id) ON DELETE RESTRICT ON UPDATE CASCADE;

DESCRIBE images;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE publications (
    _id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pub_title VARCHAR(100) NOT NULL,
    pub_description  TEXT NOT NULL,
    cat_id INT NOT NULL,
    pub_price DOUBLE NOT NULL,
    pub_shipping_cost DOUBLE DEFAULT 0, 
    pub_create_date DATETIME NOT NULL DEFAULT NOW(),
    pub_due_date DATE
);
ALTER TABLE publications 
  	ADD FOREIGN KEY (cat_id) REFERENCES categories (_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE INDEX publications_cat_id    ON publications (cat_id);
CREATE INDEX publications_pub_title ON publications (pub_title);

DESCRIBE publications;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE publish_products (
    pub_id   INT(10) NOT NULL,
    prod_id  INT(10) NOT NULL,
	FOREIGN KEY (pub_id) REFERENCES publications (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (prod_id) REFERENCES products (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (pub_id, prod_id)
);

DESCRIBE publish_products;

/* -------------------------------------------------------------------------------------------- */

CREATE TABLE sales (
    _id  INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pub_id  INT(10) NOT NULL,
    usr_id  INT(10) NOT NULL,
    sale_delivery_date  DATETIME NOT NULL,
    sale_purchase_date  DATETIME NOT NULL DEFAULT NOW(),
    sale_invoice_amount DOUBLE NOT NULL
);
ALTER TABLE sales 
  	ADD FOREIGN KEY (pub_id) REFERENCES publications (_id) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE sales 
  	ADD FOREIGN KEY (usr_id) REFERENCES users (_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

DESCRIBE sales;

/* -------------------------------------------------------------------------------------------- */

INSERT INTO categories
(_id, cat_flag_single, cat_description)
VALUES (1, true, "Underwear");

INSERT INTO categories
(_id, cat_flag_single, cat_description)
VALUES (2, true, "Dress");

INSERT INTO categories
(_id, cat_flag_single, cat_description)
VALUES (3, true, "Shorts");

INSERT INTO categories
(_id, cat_flag_single, cat_description)
VALUES (4, true, "Skirt");

INSERT INTO categories
(_id, cat_flag_single, cat_description)
VALUES (5, true, "Pants");

INSERT INTO categories
(_id, cat_flag_single, cat_description)
VALUES (6, true, "Accesories");

/* ---------------------------- */

INSERT INTO roles (_id, rol_name ) VALUES (1, "ADMIN");
INSERT INTO roles (_id, rol_name ) VALUES (2, "STANDARD");

/* ---------------------------- */

INSERT INTO configurations
(conf_delivery_time_from, conf_delivery_time_to, conf_path_image_prod, conf_name_image_prod_default)
VALUES (8, 17, "/images/", "default-image-product");

/* ---------------------------- */

INSERT INTO states (_id, state_description ) VALUES (1, "Florida");
INSERT INTO states (_id, state_description ) VALUES (2, "Georgia");
INSERT INTO states (_id, state_description ) VALUES (3, "South Carolina");

/* ---------------------------- */

INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (1, "Miami", 3, 1);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (1, "Orlando", 4, 1);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (1, "Jacksonville", 4, 1);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (1, "Tampa", 4, 1);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (1, "San Peterburgo", 4, 1);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (1, "Hialeah", 4, 1);

INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (2, "Atlanta", 5, 2);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (2, "Augusta", 5, 2);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (2, "Columbus", 5, 2);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (2, "Savannah", 5, 2);

INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (3, "Charleston", 8, 3);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (3, "Columbia", 8, 3);
INSERT INTO cities ( state_id, city_description, city_shipping_cost, city_delivery_days ) 
VALUES (3, "Florence", 8, 3);

/* ---------------------------- */

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (1, 3, "Classic jean shorts", "Excellent summer shorts for all occasions.", 20.15);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (2, 1, "Classic panties", "Black panties with delicate lace details.", 45);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (3, 2, "Greek dress", "Light beige designer dress with open neckline. Ideal for walks in spring afternoons.", 80.80);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (4, 1, "Red bodice", "Basic bodice of attractive color, very sexy and adjusted to the body.", 30);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (5, 3, "Off-road shorts", "Comfortable shorts for long walks in hot places.", 25);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (6, 5, "Ripped jean pants", "Season launch 2022. New design, ideal to accompany you in your daily activities.", 45);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (7, 5, "Workout pants", "Special pants for all kinds of physical activity. Stretch fabric, adapts to your body. Maintains body heat improving your performance.", 30.80);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (8, 4, "Woven Mini Skirt", "Mini skirt / Side slit / Invisible zipper / Composition: Elastane 10%, Cotton 90%.", 29);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (9, 3, "Eternal short", "A special short to wear in all your daily activities. Made of top quality materials that guarantee a long life of use.", 23);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (10, 5, "Casual pants", "Super light colored casual pants. For the young and active woman of today.", 50);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (11, 1, "Black mini panties", "Sensual and attractive. To expose all your physical attractiveness in your most reserved moments.", 26);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (12, 3, "Black mini short panther collection.", "For active women, practical and tight mini shorts. It adapts perfectly to any silhouette.", 25);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (13, 3, "Freestyle short", "Fun model, ideal for young dynamics..", 18);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (14, 3, "Designer shorts", "New collection of clothing season 2022. Spring colors, cheerful, light clothing. It combines with any shirt or top.", 30);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (15, 4, "Flared skirt", "Feel free, enjoy a fun skirt, joyfully live every moment of your life.", 22.6);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (16, 4, "Executive skirt", "Enjoy our exclusive executive collection. For sensual, business women.", 45);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (17, 4, "Student skirt", "Modern and attractive skirt for female students. Sober and stylish colors.", 30);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (18, 4, "Skirt for parties", "Enjoy your meetings with friends, your parties with this fabulous skirt.", 21.12);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (19, 4, "Scottish skirt", "Daring, sensual, charismatic. For modern women who like to show off their body.", 30);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (20, 4, "Caribbean style skirt", "Dazzle with this great copper colored skirt that combines in an incredible way with your Caribbean skin color.", 30);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (21, 4, "Skirt young collection 2022", "New design. Ideal for disruptive young people, with a lot of personality.", 20);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (22, 4, "Training skirt", "To accompany you in your sports routine. Comfortable, safe, elastic. Various colors.", 19);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (23, 4, "Elegant skirt", "To show off in the special moments of your life. Unique, distinguished, attractive.", 35);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (24, 4, "Long skirt", "Stretch long white skirt. It will make you look cool and modern.", 27);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (25, 4, "Ghost skirt", "Skirt to wear on unique occasions.", 15);

INSERT INTO products ( _id, cat_id, prod_title, prod_description, prod_price ) 
VALUES (26, 4, "Piaget skirt", "Mini skirt to look incredible, professional, fun. Find it in a variety of colors and textures.", 30);

/* ---------------------------- */
