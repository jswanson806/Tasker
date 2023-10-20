import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class TaskerApi {
    static token = localStorage.getItem('token') || null;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`
        const headers = { Authorization: `Bearer ${this.token}` };
        const params = (method === "get") ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch(err) {
            console.error("API Error:", err.response);
            console.log(err.response)
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
        
    }

    // ************** AUTH **************

    /** Register new user */
    static async registerUser(userInfo) {
        try {
            const res = await this.request(`auth/register`, userInfo, "post");
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
            return res;
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
    static async applyToJob(user_id, job_id) {
        try{
            const res = await this.request(`users/apply`, {
                user_id: user_id, 
                job_id: job_id
            }, "post");
            return res;
        } catch(err) {
            console.log("Error in applyToJob method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST withdraw application to job by id from user by id */
    static async withdrawApplication(user_id, job_id) {
        try{
            const res = await this.request(`users/withdraw`, {
                user_id: user_id, 
                job_id: job_id
            }, "post");
            return res;
        } catch(err) {
            console.log("Error in withdrawApplication method of the TaskerApi:", err);
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

    /** GET jobs with filter */
    static async findAndFilterJobs(filters) {
        try {
            
            const res = await this.request(`jobs/filter`, filters);
            return res;
        } catch(err) {
            console.log("Error in findAndFilterJobs method of the TaskerApi:", err);
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
            const res = await this.request(`jobs/update/${job_info.job.id}`, job_info, "patch");
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
    static async getConversationBetween(u1_id, u2_id, j_id) {
        try{
            
            const res = await this.request(`messages/conversation/${u1_id}/${u2_id}/${j_id}`);
            return res;
        } catch(err) {
            console.log("Error in getConversationBetween method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET single message by id */
    static async getSingleMessage(id) {
        try{
            const res = await this.request(`messages/${id}`);
            return res;
        } catch(err) {
            console.log("Erro is getSingleMessage method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET messages involving particular user id */
    static async getAllMessagesInvolving(id) {
        try{
            const res = await this.request(`messages/convo/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getAllMessagesInvolving method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET recent messages involving particular user id */
    static async getMostRecentConvoMessagesInvolving(id) {
        try{
            const res = await this.request(`messages/conversations/${id}`);
            return res;
        } catch(err) {
            console.log("Error in getMostRecentConvoMessagesInvolving method of the TaskerApi:", err);
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

    /** PUT a message */
    static async updateMessage(id, updateInfo) {
        try{
            const res = await this.request(`messages/update/${id}`, updateInfo, "put");
            return res;
        } catch(err) {
            console.log("Error in updateMessage method of the TaskerApi:", err);
            throw err;
        }
    }

    
    // ************** PAYMENTS **************

    /** POST a new checkout session for a job */
    static async createCheckoutSession(job) {
        try{
            const res = await this.request(`payments/create-checkout-session`, job, "post");
            return res;
        } catch(err) {
            console.log("Error in createCheckoutSession method of the TaskerApi:", err);
            throw err;
        }
    }

    // ************** S3 - IMAGES **************

    /** GET a before-image for a job 
     * 
     * Accepts params in format {data: {key: <aws_img_key>, jobId: <jobId>}}
    */
    static async getBeforeImage(params) {
        try{
            const res = await this.request(`file-storage/download-before-image`, {params});
            return res;
        } catch(err) {
            console.log("Error in getBeforeImage method of the TaskerApi:", err);
            throw err;
        }
    }

    /** GET a after-image for a job 
     * 
     * Accepts params in format {data: {key: <aws_img_key>, jobId: <jobId>}}
    */
    static async getAfterImage(params) {
        try{
            const res = await this.request(`file-storage/download-after-image`, {params});
            return res;
        } catch(err) {
            console.log("Error in getAfterImage method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST a new before-image for a job
     * 
     * Accepts arguments <form>, <userId>
    */
    static async uploadBeforeImage(form, jobId) {
        try{
            const res = await this.request(`file-storage/upload-before-image/${jobId}`, form, "post");
            return res;
        } catch(err) {
            console.log("Error in uploadBeforeImage method of the TaskerApi:", err);
            throw err;
        }
    }

    /** POST a new after-image for a job
     * 
     * Accepts params in format {data: {body: <body>, key: <aws_img_key>, jobId: <jobId>}, path: <file_path>}
    */
    static async uploadAfterImage(form, jobId) {
        try{
            const res = await this.request(`file-storage/upload-after-image/${jobId}`, form, "post");
            return res;
        } catch(err) {
            console.log("Error in uploadAfterImage method of the TaskerApi:", err);
            throw err;
        }
    }


    // ************** PAYOUTS **************

    /** GET all payouts for a single user by id */
    // static async getPayoutsForUser(id) {
    //     try{
    //         const res = await this.request(`payouts/for/${id}`);
    //         return res;
    //     } catch(err) {
    //         console.log("Error in getPayoutsForUser method of the TaskerApi:", err);
    //         throw err;
    //     }
    // }

    // /** GET all payouts from a single user by id */
    // static async getPayoutsFromUser(id) {
    //     try{
    //         const res = await this.request(`payouts/from/${id}`);
    //         return res;
    //     } catch(err) {
    //         console.log("Error in getPayoutsFromUser method of the TaskerApi:", err);
    //         throw err;
    //     }
    // }

    // /** POST a new payout for a single user by id */
    // static async createPayoutForUser(payout) {
    //     try{
    //         // trans_to is user id
    //         const { trans_to } = payout;
    //         const res = await this.request(`payouts/create/${trans_to}`, payout, "post");
    //         return res;
    //     } catch(err) {
    //         console.log("Error in createPayoutForUser method of the TaskerApi:", err);
    //         throw err;
    //     }
    // }


    // ************** REVIEWS **************

    /** GET all reviews for a single user by id */
    // static async getAllReviewsForUser(id) {
    //     try{
    //         const res = await this.request(`reviews/for/${id}`);
    //         return res;
    //     } catch(err) {
    //         console.log("Error in getAllReviewsForUser method of the TaskerApi:", err);
    //         throw err;
    //     }
    // }

    // /** GET all reviews from a single user by id */
    // static async getAllReviewsFromUser(id) {
    //     try{
    //         const res = await this.request(`reviews/from/${id}`);
    //         return res;
    //     } catch(err) {
    //         console.log("Error in getAllReviewsFromUser method of the TaskerApi:", err);
    //         throw err;
    //     }
    // }

    // /** POST a new reivew */
    // static async createReview(review) {
    //     try{
    //         const res = await this.request(`reviews/create`, review, "post");
    //         return res;
    //     } catch(err) {
    //         console.log("Error in createReview method of the TaskerApi:", err);
    //         throw err;
    //     }
    // }


}

export default TaskerApi;