/**
 *  info.system.ts
 */

const Configuration = require("../config/config");
import { TRUE } from "../types/config.types"


// https://nodejs.org/dist/latest-v15.x/docs/api/process.html#process_process

// The process object is a global.
// The process object is an instance of EventEmitter.

/**
 *  Function that allows you to expose the state of the Node JS environment at runtime.
 */

export function infoProcessSystem() {

  if (Configuration.getInstance().iWebServer.displayNodeProcess === TRUE) {
    console.log("---------------------------------------------");
    console.log("         THE NODE.JS PROCESS                 ");

    console.log("Process id ...................... " + process.pid);
    console.log("Process parent id ............... " + process.ppid);
    console.log("Title............................ " + process.title);
    console.log("Node directory .................. " + process.execPath);
    console.log("Current Directory................ " + process.cwd());
    console.log("Current Directory................ " + __dirname);
    console.log("Node version .................... " + process.version);
    console.log("Platform (S.O.).................. " + process.platform);
    console.log("Architecture (S.O.).............. " + process.arch);
    console.log("Node uptime...................... " + process.uptime());
    console.log("Process arguments................ " + process.argv);
    console.log("Specific command-line options.... " + process.execArgv);
    console.log("Exec path ....................... " + process.execPath);

    // Other posibilities
    
    //console.log('Resource usage .................. ')
    //console.log(process.resourceUsage());
    //console.log('Version Node and dependencies ... ')
    //console.log(process.versions);
    //console.log('User environment ................ ')
    //console.log(process.env);
    //console.log('Memory usage .................... ')
    //console.log(process.memoryUsage())

    console.log("---------------------------------------------");
  }
}

// ------------------------------------------------------------
