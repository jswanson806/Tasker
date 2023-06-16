"use strict";

const db = require("../db.js");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError.js");
const {partialUpdate} = require("../helpers/partialSqlUpdate.js");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** functions for users */

class User {
    /** Authenticate user with username, password.
   *
   * Returns { id, first_name, last_name, email, phone, worker }
   *
   * Throws UnauthorizedError if user not found or wrong password.
   **/

    static async authenticate(email, password) {
        // find the user in db
        const result = await db.query(
            `SELECT email,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    phone,
                    is_worker AS "isWorker"
            FROM users
            WHERE email = $1`,
            [email],
        );

        const user = result.rows[0];

        // user was found in db
        if(user){
            // use bcrypt to compare password
            const isValid = bcrypt.compare(password, user.password);
            if(isValid){ //password is valid
                delete user.password;
                return user;
            }
        }
        // user information was invalid
        throw new UnauthorizedError("Invalid email/password");
    }

    /** Registers new user with data.
     * 
     * Returns { id, email, firstName, lastName, phone, isWorker}
     * 
     * Throws BadRequestError if duplicate user is found
     */

    static async register({email, phone, password, firstName, lastName, isWorker}) {
        
        // check for duplicate user email
        const duplicateCheck = await db.query(
            `SELECT email
            FROM users
            WHERE email = $1`,
            [email],
        )
        // throw error if duplicate exists
        if(duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate email: ${email}`)
        }

        // duplicate does not exist

        // hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        
        // make insertion into database
        const result = await db.query(
            `INSERT INTO users
            (email, password, first_name, last_name, phone, is_worker)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING email, first_name AS "firstName", last_name AS "lastName", phone, is_worker AS "isWorker"`, 
            [
                email,
                hashedPassword,
                firstName,
                lastName,
                phone,
                isWorker,
            ],
        );

        const user = result.rows[0];

        return user;
    }

    /** Find all users.
   *
   * Returns [{ id, email, first_name, last_name, phone, is_worker }, ...]
   **/

    static async findAll(){
        const result = await db.query(
            `SELECT id,
                    email,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    phone,
                    is_worker AS "isWorker"
            FROM users
            ORDER by last_name`,
        );

        return result.rows;
    }


    /** Find a single user.
     * 
     * Finds all applications made by this user.
     * 
     * Returns {id, email, first_name, last_name, phone, is_worker, applications}
     *  where applications is {id, applied_by, applied_to}
     * 
     * Throws NotFoundError if user not found in db.
     */
    static async get(id){
        const result = await db.query(
            `SELECT id,
                    email,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    phone,
                    is_worker AS "isWorker"
            FROM users
            WHERE id = $1`,
            [id]
        );

        const user = result.rows[0];

        // if no such user, throw BadRequestError
        if(!user){
            throw new NotFoundError(`User not found with id: ${id}`)
        }

        // get all jobs to which user has applied
        const userApplicationsRes = await db.query(
            `SELECT a.applied_to
            FROM applications AS a
            WHERE a.applied_by = $1`,
            [user.id]
        );

        // map id of all jobs to which user has applied to array as value for "applications" key on user object
        user.applications = userApplicationsRes.rows.map(a => a.applied_to);
        return user;
    }

    /** Update user information in the database 
     * 
     * Returns {email, first_name, last_name, phone, is_worker}
     * 
     * Throws NotFoundError if user not found in db.
    */

    static async update(id, data){
        const userRes = await db.query(
            `SELECT id FROM users WHERE id = $1`,
            [id]
        )

        const user = userRes.rows[0];

        if(!user) throw new NotFoundError(`User not found with id: ${id}`)

        // hash new password with provided in data
        if(data.password){
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        // destructure columns to update and values to insert from helper function
        const { setCols, setVals } = partialUpdate(data);

        // build the query string from setCols and placeholder values
        const queryString = 
            `UPDATE users SET ${setCols}
             WHERE id = ${id}
             RETURNING email, first_name AS "firstName", last_name AS "lastName", phone, is_worker AS "isWorker"`

        // query the database with the query string and array of values to insert
        const result = await db.query(queryString, [...setVals]);

        const updatedUser = result.rows[0];

        // remove user password from data
        delete updatedUser.password;
        
        return updatedUser;
    }

    /** Remove a user from the database 
     * 
     * Returns undefined
     * 
     * Throws NotFoundError if user not found in db.
    */
    static async remove(id){
        const result = await db.query(
            `DELETE
            FROM users
            WHERE id = $1
            RETURNING id`,
            [id]
        )
        
        const user = result.rows[0];

        if(!user) throw new NotFoundError(`User not found with id: ${id}`);
    }

    /** Insert application to job by user into applications table
     * 
     * Returns undefined
     * 
     * Throws NotFoundError if user or job is not found in db
     */
    static async applyToJob(user_id, job_id){
        // query user
        const checkUser = await db.query(
            `SELECT id
            FROM users
            WHERE id = $1`,
            [user_id]
        )

        const user = checkUser.rows[0];
        // check for valid user in db
        if(!user) throw new NotFoundError(`User not found with id: ${user_id}`);

        // query job
        const checkJob = await db.query(
            `SELECT id
            FROM jobs
            WHERE id = $1`,
            [job_id]
        )
        
        const job = checkJob.rows[0];
        // check for valid job in db
        if(!job) throw new NotFoundError(`Job not found with id: ${job_id}`);
        
        // insert user_id and job_id into applications table
        await db.query(
            `INSERT INTO applications (applied_by, applied_to)
            VALUES ($1, $2)`,
            [user_id, job_id]
        )
    }

}

module.exports = User;