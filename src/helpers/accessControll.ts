/**
 * accessControll.ts
 */

import { AccessControl } from "accesscontrol";

// ------------------------------------------------------------

/*
   AccessControl -  is a Node.js module that allows you to implement two
                    access control mechanisms:
                        1) Role-based access control (RBAC)
                        2) Attribute-based access control (ABAC).
*/

const acc = new AccessControl();

/**
 * Function that sets user access permissions.
 */
exports.roles = (function () {
  acc
    .grant("STANDARD")
    .readOwn("users", ["*"])
    .updateOwn("users", ["*"])
    .readAny("states", ["*"])
    .createAny("sales", ["*"])
    .readAny("publications", ["*"])
    .readAny("categories", ["*"])
    .readAny("configuration", ["*"]);

  acc
    .grant("ADMIN")
    .readOwn("users", ["*"])
    .updateOwn("users", ["*"])
    .readAny("states", ["*"])
    .readAny("publications", ["*"])
    .readAny("categories", ["*"])
    .readAny("configuration", ["*"])
    .readAny("products", ["*"])
    .createAny("publications", ["*"])
    .updateAny("publications", ["*"])
    .createAny("images", ["*"])
    .readAny("images", ["*"]);

  acc
    .deny("STANDARD")
    .deleteAny("users")
    .deleteAny("products")
    .deleteAny("states")
    .deleteAny("sales");

  acc.deny("ADMIN").createAny("sales", ["*"]);

  return acc;
})();

// ------------------------------------------------------------
