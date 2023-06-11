"use strict";

const db = require("../db.js");
const { NotFoundError } = require("../expressError.js");

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
                    before_image_url AS "beforeImage", 
                    after_image_url AS "afterImage"
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
            RETURNING title, 
                      body, 
                      status, 
                      address, 
                      posted_by AS "postedBy", 
                      before_image_url AS "beforeImage"`,
            [title, body, address, posted_by, before_image_url]
        )

        const job = result.rows[0];

        return job
    }

    //update
    static async update(id, data){

        const setCols = []
        const setVals = []
        // starting index for SET placeholder values
        let idx = 1;

        // iterate over keys in data
        for(let key of Object.keys(data)){
            // push key and index to setCols with form 'key = $idx'
            setCols.push(`${key} = $${idx}`)
            // push values of data to setVals
            setVals.push(data[key])
            // increment idx after each loop
            idx++;
        }
        // push the id to match in the WHERE statement into the setVals array
        setVals.push(id)
        
        // build the query string from setCols and placeholder values, return the columns that were updated 
        const queryString = 
            `UPDATE jobs SET ${setCols.join(", ")}
             WHERE id = $${idx}
             RETURNING ${Object.keys(data).join(", ")}`
        console.log(queryString)
        // query the database with the query string and array of values to insert
        const result = await db.query(queryString, setVals);
        console.log(result)
        const job = result.rows[0];
        if(!job){
            throw new NotFoundError(`No job found with id: ${id}`)
        }
        console.log(job)
        return job;
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