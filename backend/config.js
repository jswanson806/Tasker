"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-key";
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const PORT = +process.env.PORT || 3001;

// sets database to development, production, or test based on env var
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? process.env.POSTGESQL_TASKER_TEST
        : process.env.DATABASE_URL || process.env.POSTGESQL_TASKER_DATABASE_URL;
}

// bcrypt work factor is faster during tests
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

// log color coded congif details on run
console.log("Tasker Congif:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY
};