const express = require('express');
const router = new express.Router();
const {ExpressError} = require('../expressError.js');
const jsonschema = require("jsonschema");
const jobUpdateSchema = require("../schemas/jobUpdateSchema.json");
const jobSchema = require("../schemas/jobSchema.json");
const Job = require("../models/job.js");
const { ensureLoggedIn, ensureIsAdmin } = require('../middleware/auth.js');

/** GET route for all jobs
 * 
 * Returns { allJobs: [{id, title, body, status, address, postedBy, assignedTo, startTime, endTime, paymentDue, beforeImage, afterImage}, ...]}
 */
router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const allJobs = await Job.findAll();
        return res.status(200).json({ allJobs: allJobs });
    } catch(err) {
        return next(err);
    }
})

/** GET route for filtering jobs
 * 
 * Returns { jobs: [{id, title, body, status, address, postedBy, assignedTo, startTime, endTime, paymentDue, beforeImage, afterImage}, ...]}
 */
router.get("/filter", ensureLoggedIn, async function(req, res, next) {
    try {
        const filteredJobs = await Job.findAndFilterJobs(req.query);
        return res.status(200).json({ jobs: filteredJobs });
    } catch(err) {
        return next(err);
    }
})

/** GET route for single job by id
 * 
 * Returns { job: {id, title, body, status, address, postedBy, assignedTo, startTime, endTime, paymentDue, beforeImage, afterImage}}
 */

router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const job = await Job.get(req.params.id);
        return res.status(200).json({ job: job });
    } catch(err) {
        return next(err);
    }
})

/** POST route to create new job
 * 
 * Validates job schema
 * 
 * Returns { Message: `Created new job with id: ${newJob.id} }`
 */
router.post("/create", ensureLoggedIn, async function(req, res, next) {
    try {
        const result = jsonschema.validate(req.body, jobSchema);
        if(!result.valid){
            const errorList = result.errors.map(err => err.stack);
            const error = new ExpressError(errorList, 404);
            return next(error);
        }

        const { job } = req.body;

        const newJob = await Job.create(job);

        return res.status(201).json({ Message: `Created new job with id: ${newJob.id}` })

    } catch(err) {
        return next(err);
    }
})

/** PATCH route for single job
 * 
 * Updates job information with complete or partial information
 * 
 * Returns { Message: `Updated job: ${updateRes}`}
*/

router.patch("/update/:id", ensureLoggedIn, async function(req, res, next) {
    try{
        const result = jsonschema.validate(req.body, jobUpdateSchema);
        if(!result.valid) {
            const errorList = result.errors.map(err => err.stack);
            const error = new ExpressError(errorList, 404);
            return next(error);
        }
        const { job } = req.body;

        const updateRes = await Job.update(job.id, job);

        return res.status(200).json({ job : { updateRes }})
    } catch(err) {
        return next(err);
    }
})

/** DELETE route to remove job by id
 * 
 * Returns status 201, { Message: `Job ${job_id} has been removed`}
  */
router.delete("/remove/:id", ensureIsAdmin, async function(req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.status(201).json({ Message: `Job ${req.params.id} has been removed`});
    } catch(err) {
        return next(err);
    }
})

module.exports = router;