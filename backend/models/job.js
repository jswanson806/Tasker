"use strict";

const db = require("../db.js");
const { NotFoundError, ExpressError } = require("../expressError.js");
const { filterSqlQuery } = require("../helpers/filterSqlQuery.js");
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
                    posted_by, 
                    assigned_to, 
                    TO_CHAR(start_time, 'MM/DD/YYYY HH:MI') AS "start_time", 
                    TO_CHAR(end_time, 'MM/DD/YYYY HH:MI') AS "end_time", 
                    payment_due, 
                    before_image_url, 
                    after_image_url
            FROM jobs
            ORDER BY title`
        );
        return result.rows;
    }

    /** Find all jobs in the database matching filter
     * 
     * Joins on applications table
     */

    static async findAndFilterJobs(data){

        if(!data) {

            throw new ExpressError('No data provided')
        }

        const {matchers, setVals} = filterSqlQuery(data);

        const queryString = 
            `SELECT j.id,
                j.title, 
                j.body, 
                j.status, 
                j.address,
                j.posted_by, 
                j.assigned_to, 
                TO_CHAR(j.start_time, 'MM/DD/YYYY HH:MI AM') AS "start_time", 
                TO_CHAR(j.end_time, 'MM/DD/YYYY HH:MI AM') AS "end_time", 
                j.payment_due, 
                j.before_image_url, 
                j.after_image_url,
                ARRAY_AGG(a.applied_by) AS "applicants"
            FROM jobs j
            LEFT JOIN applications a ON j.id = a.applied_to
            WHERE ${matchers}
            GROUP BY j.id, j.title, j.body, j.status, j.address, j.posted_by, j.assigned_to, 
                     j.start_time, j.end_time, j.payment_due, j.before_image_url, j.after_image_url
            ORDER BY j.title`;

        const result = await db.query(queryString, [...setVals]);
        
        const jobs = result.rows;

        if(!jobs) {
            throw new NotFoundError(`No matching jobs found`)
        }


        return jobs;
    }

    /** find one job by id
     * 
     * Joins on applications table 
     */
    static async get(id){
        const result = await db.query(
            `SELECT j.id,
                j.title, 
                j.body, 
                j.status, 
                j.address,
                j.posted_by, 
                j.assigned_to, 
                TO_CHAR(j.start_time, 'MM/DD/YYYY HH:MI AM') AS "start_time", 
                TO_CHAR(j.end_time, 'MM/DD/YYYY HH:MI AM') AS "end_time", 
                j.payment_due, 
                j.before_image_url, 
                j.after_image_url,
                ARRAY_AGG(a.applied_by) AS "applicants"
            FROM jobs j
            LEFT JOIN applications a ON j.id = a.applied_to
            WHERE j.id = $1
            GROUP BY j.id, j.title, j.body, j.status, j.address, j.posted_by, j.assigned_to, 
                     j.start_time, j.end_time, j.payment_due, j.before_image_url, j.after_image_url
            ORDER BY j.title`,
            [id]
        )

        const job = result.rows[0];

        if(!job) {
            throw new NotFoundError(`Job not found with id: ${id}`);
        }

        return job;
    }

    // create job

    static async create({title, body, address, posted_by, before_image_url}){
        const result = await db.query(
            `INSERT INTO jobs(
                title, 
                body, 
                status, 
                address,
                posted_by, 
                before_image_url)
            VALUES ($1, $2, 'pending', $3, $4, $5)
            RETURNING id,
                      title, 
                      body, 
                      status, 
                      address, 
                      posted_by, 
                      before_image_url`,
            [title, body, address, posted_by, before_image_url]
        )

        const job = result.rows[0];

        return job
    }

    // update job with full or partial data
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
             RETURNING id,
                       title, 
                       body, 
                       status, 
                       address, 
                       posted_by, 
                       before_image_url,
                       after_image_url`

        // query the database with the query string and array of values to insert
        const result = await db.query(queryString, [...setVals]);

        const updatedJob = result.rows[0];

        return updatedJob;
    }
    
    // remove job by id
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