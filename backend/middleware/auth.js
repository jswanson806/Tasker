"use strict";

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js');
const { UnauthorizedError } = require("../expressError.js");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the email, isWorker, and isAdmin fields.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next){
    try {
        const authHeader = req.headers && req.headers.authorization;
        if(authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch(err) {
        return next();
    }
}

/** Middleware: Ensure user is logged in.
 *
 * If res.locals.user is undefined, throws UnauthorizedError
 */

function ensureLoggedIn(req, res, next){
    try {
        if(!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err);
    }
}

/** Middleware: Ensure user isWorker property is true.
 *
 * Verifies user is passed in req and user contains isWorker property set to true
 * 
 * Throws UnauthorizedError if false
 */

function ensureWorker(req, res, next){
    try {
        if(!res.locals.user || res.locals.user.isWorker !== true) throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err);
    }
}

/** Middleware: Authenticate user.
 *
 * Verifies user is logged in and user.email matches the email passed in params
 *  or that the user is an admin
 * 
 * Throw UnauthorizedError if false
 */

function ensureCorrectUserOrAdmin(req, res, next){
    try {
        const user = res.locals.user;
        if(!user || !(user.isAdmin === true || user.email === req.params.email)){
            throw new UnauthorizedError();
        }
        return next();
    } catch(err) {
        return next(err);
    }
}

module.exports = { 
    authenticateJWT, 
    ensureLoggedIn, 
    ensureWorker, 
    ensureCorrectUserOrAdmin 
};