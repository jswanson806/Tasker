const express = require('express');
const router = new express.Router();
const {ExpressError} = require('../expressError.js');
const jsonschema = require("jsonschema");
const userUpdateSchema = require("../schemas/userUpdateSchema.json");
const User = require("../models/user.js");
const { ensureCorrectUserOrAdmin, ensureIsAdmin, ensureLoggedIn, ensureIsWorker } = require('../middleware/auth.js');

/** Get route for all users.
 * 
 * Returns object with array of user objects
 *  { allUsers: [{ id, email, firstName, lastName, phone, isWorker, isAdmin }, ...] }
 */
router.get("/", ensureIsAdmin, async function(req, res, next) {
    try {
        const allUsers = await User.findAll();
        return res.status(200).json({ allUsers: allUsers });
    } catch(err) {
        return next(err);
    }
})

/** Get route for single user by id
 * 
 * 
 * Returns {user: { id, email, first_name, last_name, phone, is_worker, applications }}
 *  where applications is { id, applied_by, applied_to }
 */
router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const user = await User.get(req.params.id)
        return res.status(200).json({ user })
    } catch(err) {
        return next(err);
    }

})

router.post("/apply", ensureIsWorker, async function(req, res, next) {
    const { user_id, job_id } = req.body;
    try {
        await User.applyToJob(user_id, job_id);
        return res.status(201).json({ Message: `User ${user_id} applied to job ${job_id}` });
    } catch(err) {
        return next(err);
    }
})

router.post("/withdraw", ensureIsWorker, async function(req, res, next) {
    const { user_id, job_id } = req.body;
    try {
        await User.withdrawApplication(user_id, job_id);
        return res.status(201).json({ Message: `User ${user_id} withdrew application to job ${job_id}` });
    } catch(err) {
        return next(err);
    }
})

/** Patch route for a single user
 * 
 * Middlware verifies user id matches that of user in res.locals or that user is admin
 * 
 * Updates user information with complete or partial information
 * 
 * Returns { Message: `Updated user ${user.id}: ${updateRes}` }
 */
router.patch("/update/:id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const result = jsonschema.validate(req.body, userUpdateSchema)
        if(!result.valid) {
            const errorList = result.errors.map(err => err.stack);
            const error = new ExpressError(errorList, 400);
            return next(error);
        }

        const { user } = req.body;

        const updateRes = await User.update(user.id, user)

        return res.status(200).json({ Message: `Updated user ${user.id}: ${updateRes}` })
    } catch(err) {
        return next(err);
    }
    
})

/** Delete route to remove user by id
 * 
 * Middleware verifies that user is admin
 * 
 * Returns status 201, { Message: `User ${req.params.id} has been removed` }
 */
router.delete("/remove/:id", ensureIsAdmin, async function(req, res, next) {
    try {
        await User.remove(req.params.id);
        return res.status(201).json({ Message: `User ${req.params.id} has been removed` });
    } catch(err) {
        return next(err);
    }
})

module.exports = router;