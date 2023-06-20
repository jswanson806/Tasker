const express = require('express');
const router = new express.Router();
const {ExpressError} = require('../expressError.js');
const jsonschema = require("jsonschema");
const messageSchema = require("../schemas/messageSchema.json");
const Message = require("../models/message.js");

/** GET route for conversation between two users
 * 
 * Middleware validates correct user or admin
 * 
 * Returns {"Messages": [{id, body, sentBy, sentTo, createdAt}, ...]}
 * 
 */
router.get("/conversation/:u1_id/:u2_id", async function(req, res, next) {
    const u1 = req.params.u1_id;
    const u2 = req.params.u2_id;
    try {
        const convoRes = await Message.getConversation(u1, u2);
        return res.status(200).json({conversation: convoRes})
    } catch(err) {
        return next(err);
    }
})

/** POST route to create a new message
 * 
 * Middleware validates correct user
 * 
 * Returns {Message: 'Message Sent'}
 */
router.post("/create", async function(req, res, next) {
    try {
        const result = jsonschema.validate(req.body, messageSchema);
        if(!result.valid){
            const errorList = result.errors.map(err => err.stack);
            const error = new ExpressError(errorList, 404);
            return next(error);
        }

        const { message } = req.body;
        const messageRes = await Message.create(message)

        return res.status(201).json({ Message: 'Message sent' })
    } catch(err) {
        return next(err);
    }
})

module.exports = router;