const express = require('express');
const router = new express.Router();
const {ExpressError} = require('../expressError.js');
const jsonschema = require("jsonschema");
const messageSchema = require("../schemas/messageSchema.json");
const messageUpdateSchema = require("../schemas/messageUpdateSchema.json");
const Message = require("../models/message.js");
const { ensureLoggedIn } = require("../middleware/auth.js");

/** GET route for conversation between two users
 * 
 * Middleware validates logged in status
 * 
 * Returns {"conversation": [{convo_id, body, sent_by, sent_to, created_at, is_read}, ...]}
 * 
 */
router.get("/conversation/:u1_id/:u2_id/:j_id", ensureLoggedIn, async function(req, res, next) {
    const u1 = req.params.u1_id;
    const u2 = req.params.u2_id;
    const j = req.params.j_id;

    try {
        const convoRes = await Message.getConversation(u1, u2, j);
        return res.status(200).json({conversation: convoRes})
    } catch(err) {
        return next(err);
    }
})

/** GET route for signle messages by id
 * 
 * Middleware validates logged in status
 * 
 * Returns {convo_id, body, sent_by, sent_to, created_at, is_read}
 * 
 */
router.get("/:id", ensureLoggedIn, async function(req, res, next) {

    try {
        const messageRes = await Message.getSingleMessage(req.params.id);
        return res.status(200).json({messageRes})
    } catch(err) {
        return next(err);
    }
})

/** GET route for unique messages for each conversation between two unique users
 * 
 * Middleware validates logged in status
 * 
 * Returns {"recent_messages": [{convo_id, body, sent_by, sent_to, created_at, is_read}, ...]}
 * 
 */
router.get("/conversations/:id", ensureLoggedIn, async function(req, res, next) {

    try {
        const messagesRes = await Message.getRecentConvoMessagesInvolving(req.params.id);
        return res.status(200).json({recentMessages: messagesRes})
    } catch(err) {
        return next(err);
    }
})

/** GET route for conversations involving a particular user
 * 
 * Middleware validates logged in status
 * 
 * Returns {"messages": [{convo_id, body, sent_by, sent_to, created_at, is_read}, ...]}
 * 
 */
router.get("/convo/:id", ensureLoggedIn, async function(req, res, next) {
 
    try {
        const messagesRes = await Message.getAllMessagesInvolving(req.params.id);
        return res.status(200).json({messages: messagesRes})
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
router.post("/create", ensureLoggedIn, async function(req, res, next) {
    try {
        const result = jsonschema.validate(req.body, messageSchema);
        if(!result.valid){
            const errorList = result.errors.map(err => err.stack);
            const error = new ExpressError(errorList, 404);
            return next(error);
        }
        
    
        const { message } = req.body;
        await Message.create(message)

        return res.status(201).json({ Message: 'Message sent' })
    } catch(err) {
        return next(err);
    }
})

/** PUT route to update a message's read status
 * 
 * Middleware validates logged in status of user
 * 
 * Returns {convo_id, body, sent_by, sent_to, created_at, is_read}
 */
router.put("/update/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const result = jsonschema.validate(req.body, messageUpdateSchema);
        if(!result.valid){
            const errorList = result.errors.map(err => err.stack);
            const error = new ExpressError(errorList, 404);
            return next(error);
        }
        
    
        const { message } = req.body;
        const updateRes = await Message.update(req.params.id, message.is_read);

        return res.status(201).json({ updateRes })
    } catch(err) {
        return next(err);
    }
})

module.exports = router;