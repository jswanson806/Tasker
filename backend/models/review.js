"use strict";

const db = require("../db.js");
const { NotFoundError, BadRequestError } = require("../expressError.js");

class Review {

    /** Find all reviews for a single user 
     * 
     * Returns reviews as [{id, title, body, stars}, ...]
     *  in descending order of id
    */
   static async getForUser(id) {
        const result = await db.query(
            `SELECT id, title, body, stars 
            FROM reviews
            WHERE reviewed_for = $1
            ORDER BY id DESC`,
            [id]
        )

        const reviews = result.rows     
        if(reviews.length === 0){
            throw new NotFoundError(`No reviews available for user: ${id}`)
        }

        return reviews;
    }

    /** Find all reviews by a single user 
     * 
     * Returns reviews as [{id, title, body, stars}, ...]
     *  in descending order of id
    */
    static async getFromUser(id) {
        const result = await db.query(
            `SELECT id, title, body, stars
            FROM reviews
            WHERE reviewed_by = $1
            ORDER BY id DESC`,
            [id]
        )

        const reviews = result.rows;
        if(reviews.length === 0){
            throw new NotFoundError(`No reviews available from user: ${id}`)
        }

        return reviews;
    }


    /** Creates a new review
     * 
     * Returns review as {id, title, body, stars, reviewed_by, reviewed_for}
     * 
     * Throws BadRequest error if reviewed_for is invalid user id
    */
    static async create({title, body, stars, reviewed_by, reviewed_for}) {
        const userResult = await db.query(
            `SELECT id 
            FROM users
            WHERE id = $1`,
            [reviewed_for]
        )

        const user = userResult.rows[0];

        if(!user){
            throw new BadRequestError(`Invalid user id: ${reviewed_for}`);
        }

        const result = await db.query(
            `INSERT INTO reviews(title, body, stars, reviewed_by, reviewed_for)
            VALUES($1, $2, $3, $4, $5)
            RETURNING id, title, body, stars, reviewed_by, reviewed_for`,
            [title, body, stars, reviewed_by, reviewed_for]
        )
        
        const review = result.rows[0];

        

        return review;
    }

    /** Calculates average rating of the user matching provided id 
     * 
     * Returns (sum of all ratings / number of ratings) to 1 decimal place
    */
    static async getAverageRating(id){

        // query the db for all reviews user with this id
        const result = await db.query(
            `SELECT id, title, body, stars 
            FROM reviews
            WHERE reviewed_for = $1
            ORDER BY id DESC`,
            [id]
        )

        const reviews = result.rows

        if(reviews.length === 0){ // throw error if no reviews exist for this user
            throw new NotFoundError(`No reviews available for user: ${id}`)
        }

        // hold ratingTotal
        let ratingTotal = 0;
        // hold iteration count
        let count = 0;
        // iterate over reviews
        for(let review of reviews){
            // increment count
            count++;
            // add star value of each review to ratingTotal
            ratingTotal += review.stars;
        }
        // calculate average rating
        const avgRating = ratingTotal/count;
        // convert to number and round to 1 decimal place
        const roundedAverage = +avgRating.toFixed(1);

        return roundedAverage;
    }
}

module.exports = Review;