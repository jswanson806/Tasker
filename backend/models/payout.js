"use strict";

const db = require('../db.js');
const { NotFoundError } = require('../expressError.js');

class Payout {
    /** Find all payouts made to single user 
     * 
     * Used to display payment history on worker account and generate transactions via Stripe
     * 
     * Returns [{id, trans_by, trans_for, subtotal, tax, tip, total}, ...]
     * 
     * Throws error if user is invalid -or- no payouts available
    */
    static async getFor(id){

        // check for user first
        const userRes = await db.query(
            `SELECT id FROM users WHERE id = $1`,
            [id]
        )

        const user = userRes.rows[0];

        if(!user){ // error if no user found
            throw new NotFoundError(`No user found with id: ${id}`)
        }

        // query payouts for this user
        const result = await db.query(
            `SELECT p.id, 
                    p.subtotal,
                    p.tip,
                    p.tax,
                    p.total,
                    p.created_at
            FROM payouts AS p
            JOIN users AS u ON p.trans_to = u.id
            WHERE u.id = $1
            ORDER BY created_at DESC`,
            [id]
        )

        const payouts = result.rows;

        if(payouts.length === 0){ // error if no payouts found
            throw new NotFoundError(`No payouts found for user: ${id}`)
        }

        return payouts;
    }

    /** Find all payouts made by single user 
     * 
     * Used to display payment history on user account and generate transactions via Stripe
     * 
     * Returns [{id, trans_by, trans_for, subtotal, tax, tip, total}, ...]
     * 
     * Throws error if user is invalid -or- no payouts available
    */
    static async getFrom(id){

        // check for user first
        const userRes = await db.query(
            `SELECT id FROM users WHERE id = $1`,
            [id]
        )

        const user = userRes.rows[0];

        if(!user){ // error if no user found
            throw new NotFoundError(`No user found with id: ${id}`)
        }

        // query payouts for this user
        const result = await db.query(
            `SELECT p.id, 
                    p.subtotal,
                    p.tip,
                    p.tax,
                    p.total,
                    p.created_at
            FROM payouts AS p
            JOIN users AS u ON p.trans_by = u.id
            WHERE u.id = $1
            ORDER BY created_at DESC`,
            [id]
        )

        const payouts = result.rows;

        if(payouts.length === 0){ // error if no payouts found
            throw new NotFoundError(`No payouts found for user: ${id}`)
        }

        return payouts;
    }


    /** Create payout for a single user 
     * 
     * Returns {payout_to, subtotal, tax, tip, total, created_at}
     * 
     * Throws error if user is invalid
    */

    static async create({ trans_to, trans_by, subtotal, tax, tip, total }) {
        // check for user first
        const userRes = await db.query(
            `SELECT id FROM users WHERE id = $1`,
            [trans_to]
        )

        const user = userRes.rows;

        if(user.length === 0){ // error if no user found
            throw new NotFoundError(`No user found with id: ${trans_to}`)
        }

        // create payout for this user
        const result = await db.query(
            `INSERT INTO payouts(trans_to, trans_by, subtotal, tax, tip, total, created_at)
            VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING trans_to, trans_by, subtotal, tax, tip, total, created_at`,
            [trans_to, trans_by, subtotal, tax, tip, total]
        )

        const payout = result.rows[0];

        return payout;
    }

}

module.exports = Payout;