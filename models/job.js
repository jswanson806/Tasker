"use strict";

const db = require("../db.js");
const { NotFoundError, ExpressError } = require("../expressError.js");
const { partialUpdate } = require("../helpers/partialSqlUpdate.js");

class Job {
    
    /** Find all jobs in the database available for workers to apply */

    static async getAllAvailableJobs(){
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
            WHERE assigned_to IS NULL AND status = 'pending'
            ORDER BY title`
        );
        
        return result.rows;
    }

    /** Find all jobs in the database to which worker has already applied */

    static async getAllAppliedWorkerJobs(workerId){
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
            WHERE a.applied_by = $1
            GROUP BY j.id, j.title, j.body, j.status, j.address, j.posted_by, j.assigned_to, 
                     j.start_time, j.end_time, j.payment_due, j.before_image_url, j.after_image_url
            ORDER BY j.title`,
            [workerId]
        );
        
        return result.rows;
    }

    /** Find all jobs in the database to which worker has been assigned */

    static async getAllAssignedWorkerJobs(workerId){
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
            WHERE assigned_to = $1 AND status = 'active'
            ORDER BY title`,
            [workerId]
        );
        
        return result.rows;
    }

    /** Find all jobs in the database posted by single user which are pending review */

    static async getAllPendingReviewUserJobs(userId){
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
            WHERE posted_by = $1 AND status = 'pending review'
            ORDER BY title`,
            [userId]
        );
        
        return result.rows;
    }

    /** find all jobs posted by a single user
     * 
     * Joins on applications table 
     */
    static async getAllJobsPostedByUser(userId){
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
            WHERE j.posted_by = $1
            GROUP BY j.id, j.title, j.body, j.status, j.address, j.posted_by, j.assigned_to, 
                     j.start_time, j.end_time, j.payment_due, j.before_image_url, j.after_image_url
            ORDER BY j.status, j.title`,
            [userId]
        )

        const job = result.rows;

        return job;
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
                       start_time,
                       end_time,
                       payment_due, 
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