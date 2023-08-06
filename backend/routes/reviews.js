const express = require('express');
const router = new express.Router();
const {ExpressError} = require('../expressError.js');
const jsonschema = require("jsonschema");
const reviewSchema = require("../schemas/reviewSchema.json");
const Review = require("../models/review.js");
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require('../middleware/auth.js');

/** GET route for reviews made FOR a single user 
 * 
 * Returns { Reviews: [{id, title, body, stars, reviewed_by, reviewed_for}, ...] }
 */
router.get("/for/:id", async function(req, res, next){
    const { id } = req.params;
    try {
        const result = await Review.getForUser(id);
        return res.status(200).json({reviews: result });
    } catch(err) {
        return next(err);
    }
})

/** GET route for reviews made FROM a single user 
 * 
 * Returns { Reviews: [{id, title, body, stars, reviewed_by, reviewed_for}, ...] }
 */
router.get("/from/:id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    const { id } = req.params;
    try {
        const result = await Review.getFromUser(id);
        return res.status(200).json({reviews: result});
    } catch(err) {
        return next(err);
    }
})

/** POST route for creating a new review
 * 
 * Returns { Message: 'Review submitted for user: <user_id>'}
 */
router.post("/create", ensureLoggedIn, async function(req, res, next) {
    const result = jsonschema.validate(req.body, reviewSchema);

    if(!result.valid){
        const errorList = result.errors.map(err => err.stack);
        const error = new ExpressError(errorList, 400);
        return next(error);
    }

    try {
        const { review } = req.body;

        const reviewRes = await Review.create(review);

        return res.status(201).json({Message: `Review submitted for user: ${review.reviewed_for}`})
    } catch(err) {
        return next(err);
    }
})

module.exports = router;