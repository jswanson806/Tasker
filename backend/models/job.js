"use strict";

const db = require("../db.js");
const { NotFoundError } = require("../expressError.js");
const { partialUpdate } = require("../helpers/partialSqlUpdate.js");

class Job {
    
    /** Find all jobs in the database */

    static async findAll(){
        const result = await db.query(
            `SELECT id,
                    title, 
                    body, 
                    status, 
                    address,
                    posted_by AS "postedBy", 
                    assigned_to AS "assignedTo", 
                    TO_CHAR(start_time, 'MM/DD/YYYY HH:MI') AS "startTime", 
                    TO_CHAR(end_time, 'MM/DD/YYYY HH:MI') AS "endTime", 
                    payment_due AS "paymentDue", 
                    before_image_url AS "beforeImageUrl", 
                    after_image_url AS "afterImageUrl"
            FROM jobs
            ORDER BY title`
    )
    return result.rows;
    }

    //find one
    static async get(id){
        const result = await db.query(
            `SELECT id,
                    title, 
                    body, 
                    status, 
                    address,
                    posted_by AS "postedBy", 
                    assigned_to AS "assignedTo", 
                    TO_CHAR(start_time, 'MM/DD/YYYY HH:MI AM') AS "startTime", 
                    TO_CHAR(end_time, 'MM/DD/YYYY HH:MI AM') AS "endTime", 
                    payment_due AS "paymentDue", 
                    before_image_url AS "beforeImageUrl", 
                    after_image_url AS "afterImageUrl"
            FROM jobs
            WHERE id = $1`,
            [id]
        )

        const job = result.rows[0];

        if(!job) {
            throw new NotFoundError(`Job not found with id: ${id}`);
        }

        return job;
    }

    //create job

    static async create({title, body, address, posted_by, before_image_url}){
        const result = await db.query(
            `INSERT INTO jobs(
                title, 
                body, 
                status, 
                address,
                posted_by, 
                before_image_url)
            VALUES ($1, $2, 'posted', $3, $4, $5)
            RETURNING id,
                      title, 
                      body, 
                      status, 
                      address, 
                      posted_by AS "postedBy", 
                      before_image_url AS "beforeImageUrl"`,
            [title, body, address, posted_by, before_image_url]
        )

        const job = result.rows[0];

        return job
    }

    //update
    static async update(id, data){
        // check for job with id to exist first
        const jobRes = await db.query(
            `SELECT id FROM jobs WHERE id = $1`,
            [id]
        )

        const job = jobRes.rows[0];

        if(!job){
            throw new NotFoundError(`No job found with id: ${id}`)
        }

        // destructure columns to update and values to insert from helper function
        const { setCols, setVals } = partialUpdate(data);
        
        // build the query string from setCols and placeholder values
        const queryString = 
            `UPDATE jobs SET ${setCols}
             WHERE id = ${id}
             RETURNING title, body, status, address`

        // query the database with the query string and array of values to insert
        const result = await db.query(queryString, [...setVals]);

        const updatedJob = result.rows[0];
        console.log(updatedJob)
        return updatedJob;
    }
    
    //remove
    static async remove(id){
        const result = await db.query(
            `DELETE from jobs
            WHERE id = $1
            RETURNING id`,
            [id]
        )

        const job = result.rows[0];

        if(!job){
            throw new NotFoundError(`No job found with id: ${id}`)
        }
    }

}





module.exports = Job;