"use strict";

const db = require("../db.js");
const { NotFoundError } = require("../expressError.js");

class Message {

    /** Find all messages between two users 
     * 
     * concatenates user ids to form unique id to match to conversations table in form
     *  < u + lower id value + u + greater id value >
     * 
     * Returns messages as [{id, body, conversation_id, sent_by, sent_to, created_at}, ...]
     *  ordered from latest to oldest message
    */
    static async getConversation(user_id1, user_id2, job_id){
        // get unique id for conversation
        let convoId = this.generateConvoId(user_id1, user_id2, job_id)

        const result = await db.query(
            `SELECT m.body, TO_CHAR(m.created_at, 'MM/DD/YYYY HH:MI AM') AS created_at
            FROM messages AS m
            JOIN conversations AS c ON m.conversation_id = c.id
            WHERE c.id = $1
            ORDER BY m.created_at DESC`,
            [convoId]
        )

        const messages = result.rows;

        if(messages.length === 0){ // throws error if no conversation exists between these users
            throw new NotFoundError(`No messages found`)
        }

        return messages;
    }


    /** Create new message 
     * 
     * Returns message {body, conversation_id, sent_by, sent_to, created_at}
    */
    static async create({body, sent_by, sent_to, job_id}){
        // get unique id for conversation
        let convoId = this.generateConvoId(sent_by, sent_to, job_id)

        // query existing conversation from db
        const existingConvo = await db.query(
            `SELECT id FROM conversations WHERE id = $1`, 
            [convoId]
        )

        // if no conversation currently exists between these users, insert into conversations table
        if(existingConvo.rows.length === 0){
            await db.query(
                `INSERT INTO conversations(id, created_at)
                VALUES ($1, CURRENT_TIMESTAMP)`,
                [convoId]
            );
        }

        // insert into messages table
        const result = await db.query(
            `INSERT INTO messages(body, conversation_id, sent_by, sent_to, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING body, conversation_id, sent_by, sent_to, created_at`,
            [body, convoId, sent_by, sent_to]
        )
  
        const message = result.rows[0]

        return message;
    }

    /** Make unique id from two user id's
     * 
     * concatenates user ids to form unique id to match to conversations table in form
     *  < u + lesser id value + u + greater id value + job_id>
     * 
     * Returns unique id as string
     */
    static generateConvoId(user_id1, user_id2, job_id){
        let uniqueId = user_id1 > user_id2 ? `u${user_id2}u${user_id1}j${job_id}` : `u${user_id1}u${user_id2}j${job_id}`;
        return uniqueId;
    }

}

module.exports = Message;