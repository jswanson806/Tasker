const express = require('express');
const router = new express.Router();
const {ExpressError} = require('../expressError.js');
const jsonschema = require("jsonschema");
const payoutSchema = require("../schemas/payoutSchema.json");
const Payout = require("../models/payout.js");
const { ensureCorrectUserOrAdmin, ensureIsAdmin } = require("../middleware/auth.js");

/** GET route for payouts FOR a single user */
router.get("/for/:id", ensureCorrectUserOrAdmin, async function(req, res, next){
    const { id } = req.params;
    try {
        const resp = await Payout.getFor(id);
        return res.status(200).json({ payouts: resp})
    } catch(err) {
        return next(err);
    }
});

/** GET route for payouts FROM a single user */
router.get("/from/:id", ensureCorrectUserOrAdmin, async function(req, res, next){
    const { id } = req.params;
    try {
        const resp = await Payout.getFrom(id);
        return res.status(200).json({ payouts: resp})
    } catch(err) {
        return next(err);
    }
});

/** POST route for creating a payout */
router.post("/create/:id", ensureIsAdmin, async function(req, res, next){
    
    const result = jsonschema.validate(req.body, payoutSchema);
    if(!result.valid){
        const errorList = result.errors.map(err => err.stack);
        const error = new ExpressError(errorList, 400);
        return next(error);
    }
    
    try {
        const { payout } = req.body;
        const resp = await Payout.create(payout);
        return res.status(201).json({ Message: `Created new payout for user: ${req.params.id}`})
    } catch(err) {
        return next(err);
    }
});

module.exports = router;