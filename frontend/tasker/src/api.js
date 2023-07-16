import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

class TaskerApi {
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`
        const headers = { Authorization: `Bearer ${TaskerApi.token}` };
        const params = (method === "get") ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch(err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // ************** AUTH **************

    /** Register new user */
    static async registerUser(userInfo) {
        try {
            const res = await this.request(`auth/register`, userInfo, "post");
            console.log("RES:", res)
            return res.token;
        } catch(err) {
            console.log("Error in registerUser method of the TaskerApi:", err);
            throw err;
        }
    }

    /** Login existing user */
    static async login(email, password) {
        try {
            const res = await this.request(`auth/token`, {
                email: email, 
                password: password
            }, "post");
            return res.token;
        } catch(err) {
            console.log("Error in login method of the TaskerApi:", err);
            throw err;
        }
    }


    // ************** USERS **************

    /** GET all users */
    static async getAllUsers() {
        try{
            const res = await this.request(`users`);
            return res;
        } catch(err) {
            console.log("Error in getAllUsers method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET single user by id */
    static async getSingleUser(id) {
        try{
            const res = await this.request(`users/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getSingleUser method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST application for job by id from user by id */
    static async applyToJob(id, job_id) {
        try{
            const res = await this.request(`users/${id}/apply/${job_id}`, {}, "post");
            return res;
        } catch(err) {
            console.log("Error in applyToJob method of the TaskerApi:", err);
            throw err;
        }
    }

    /** PATCH single user by id */
    static async updateSingleUser(id) {
        try{
            const res = await this.request(`users/update/${id}`, {}, "patch");
            return res;
        } catch(err) {
            console.log("Error in updateSingleUser method of the TaskerApi:", err);
            throw err;
        }
    }

    /** DELETE single user by id */
    static async deleteSingleUser(id) {
        try{
            const res = await this.request(`users/remove/${id}`, {}, "delete");
            return res;
        } catch(err) {
            console.log("Error in deleteSingleUser method of the TaskerApi:", err);
            throw err;
        }
    }


    // ************** JOBS **************

    /** GET all jobs */
    static async getAllJobs() {
        try{
            const res = await this.request(`jobs`);
            return res;
        } catch(err) {
            console.log("Error in getAllJobs method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET single job by id */
    static async getSingleJob(id) {
        try{
            const res = await this.request(`jobs/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getSingleJob method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST new job */
    static async createJob(job_info) {
        try{
            const res = await this.request(`jobs/create`, job_info, "post");
            return res;
        } catch(err) {
            console.log("Error in createJob method of the TaskerApi:", err);
            throw err;
        }
    }

    /** PATCH single job by id*/
    static async updateSingleJob(job_info) {
        try{
            const res = await this.request(`jobs/update/${job_info.id}`, job_info, "patch");
            return res;
        } catch(err) {
            console.log("Error in updateSingleJob method of the TaskerApi:", err);
            throw err;
        }
    }

    /** DELETE single job by id */
    static async deleteSingleJob(id) {
        try{
            const res = await this.request(`jobs/remove/${id}`, {}, "delete");
            return res;
        } catch(err) {
            console.log("Error in deleteSingleJob method of the TaskerApi:", err);
            throw err;
        }
    }


    // ************** MESSAGES **************

    /** GET conversation between two users by id */
    static async getConversationBetween(u1_id, u2_id) {
        try{
            const res = await this.request(`messages/conversation/${u1_id}/${u2_id}`);
            return res;
        } catch(err) {
            console.log("Error in getConversationBetween method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST a new message */
    static async createMessage(message) {
        try{
            const res = await this.request(`messages/create`, message, "post");
            return res;
        } catch(err) {
            console.log("Error in createMessage method of the TaskerApi:", err);
            throw err;
        }
    }

    // ************** PAYOUTS **************

    /** GET all payouts for a single user by id */
    static async getPayoutsForUser(id) {
        try{
            const res = await this.request(`payouts/for/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getPayoutsForUser method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET all payouts from a single user by id */
    static async getPayoutsFromUser(id) {
        try{
            const res = await this.request(`payouts/from/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getPayoutsFromUser method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST a new payout for a single user by id */
    static async createPayoutForUser(payout) {
        try{
            // trans_to is user id
            const { trans_to } = payout;
            const res = await this.request(`payouts/create/${trans_to}`, payout, "post");
            return res;
        } catch(err) {
            console.log("Error in createPayoutForUser method of the TaskerApi:", err);
            throw err;
        }
    }


    // ************** REVIEWS **************

    /** GET all reviews for a single user by id */
    static async getAllReviewsForUser(id) {
        try{
            const res = await this.request(`reviews/for/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getAllReviewsForUser method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET all reviews from a single user by id */
    static async getAllReviewsFromUser(id) {
        try{
            const res = await this.request(`reviews/from/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getAllReviewsFromUser method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST a new reivew */
    static async createReview(review) {
        try{
            const res = await this.request(`reviews/create`, review, "post");
            return res;
        } catch(err) {
            console.log("Error in createReview method of the TaskerApi:", err);
            throw err;
        }
    }

}

export default TaskerApi;