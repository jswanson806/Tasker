const express = require('express');
const router = new express.Router();
const {BadRequestError, UnauthorizedError} = require('../expressError.js');
const jsonschema = require("jsonschema");
const { createToken } = require("../helpers/tokens.js");
const userAuthSchema = require('../schemas/userAuthSchema.json');
const userSchema = require('../schemas/userSchema.json');
const User = require('../models/user.js');


/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { email, password } = req.body;
        const user = await User.authenticate(email, password);
        const token = createToken(user);
        return res.json({token, user});
    } catch(err) {
        return next(err);
    }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { email, password, firstName, lastName, phone }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { user } = req.body;

        const newUser = await User.register({...user, isAdmin: false})
        await User.authenticate(email, password);
        const token = createToken(newUser);
        return res.status(201).json({token});
    } catch(err) {
        console.log(err)
        return next(err);
    }
})

module.exports = router;