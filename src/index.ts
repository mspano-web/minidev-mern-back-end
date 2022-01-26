/**
 * index.ts: application entry point
 *           Web server creation with NodeJS and express configuration
 */

import { App } from './app'

/* ---------------------------------------------- */

/**
 *  Minidev application starting point
 */


async function main() {
    const app = new App();
    await app.listen();
}

/* ---------------------------------------------- */

main();

/* ------------------------------------------------------------------------ */

