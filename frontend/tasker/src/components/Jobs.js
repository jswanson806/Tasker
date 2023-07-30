import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api';
import JobCard from './JobCard.js';
import { UserContext } from '../helpers/UserContext';

const Jobs = () => {

    const {user} = useContext(UserContext)

    const [jobs, setJobs] = useState([]);
    const [jobCards, setJobCards] = useState([]);
    const [showUserJobs, setShowUserJobs] = useState(false);
    const [currUser, setCurrUser] = useState(null);
    
    // on initial render, calls functions to set state of currUser and jobs
    useEffect(() => {

        fetchCurrUser(JSON.parse(user).id);
        fetchAndSetJobs();
        
    }, []);


    // creates job cards if currUser and jobs are populated.
    useEffect(() => {
        
        // only call once jobs have been populated
        if(jobs.length && currUser) {
            createJobCards();
        }
        
    }, [jobs, showUserJobs, currUser])


    /**
    * Fetches the current user's data, filters out already applied jobs,
    * and creates JobCard components for each unapplied job in the 'jobs' list.
    *
    */
    async function createJobCards(){
        // create Set from existing user applications
        const applications = new Set(currUser.applications);
        
        // sets state of jobCards based on filtering logic related to user applications
        setJobCards(jobs.map((job) => {
            // filter out jobs to which user has already applied
            if(!applications.has(job.id) && !showUserJobs) {
                return <JobCard user={JSON.parse(user)} job={job} fetchCurrUser={fetchCurrUser} key={job.id}/>
            }
            // filter out jobs to which user has not already applied
            if(applications.has(job.id) && showUserJobs) {
                return <JobCard user={JSON.parse(user)} job={job} fetchCurrUser={fetchCurrUser} key={job.id}/>
            }
        }));
    }


    /**
    * Fetches data for a single user from the Tasker API based on the given ID.
    *
    * @async
    * @function fetchCurrUser
    * @param {number} id - The ID of the user to fetch.
    * @returns {Promise<object>} A Promise that resolves with the user data as an object.
    * @throws {Error} If there's an error during the API call or the user data cannot be retrieved.
    */
    async function fetchCurrUser(id){
        try {
            const res = await TaskerApi.getSingleUser(id);
            const { user } = res;
            setCurrUser(user);
        } catch(err) {
            throw err;
        }
    }


    /** Retrieves all jobs from api
    * 
    * Sets state of jobs
    */
    async function fetchAndSetJobs() {
        try{
            const jobsRes = await TaskerApi.getAllJobs();
            const { allJobs } = jobsRes;
            setJobs(allJobs);
        } catch(err) {
            return err;
        }
    }

    /** Inverts the state of showUserJobs 
     * 
     * Sets state of showUserJobs
    */
    const toggleUserJobs = () => {
        setShowUserJobs(!showUserJobs);
    }

    // conditionally renders a button element depending on isWorker property of user
    const toggleJobsButton = JSON.parse(user).isWorker === true 
        ? 
        <button onClick={toggleUserJobs}>{showUserJobs ? 'All Jobs' 
        : 
        'My Jobs'}</button> : '';


    return (
        <div>
            <h1>{showUserJobs ? 'My Jobs' : 'All Jobs'}</h1>
            <div>
                {toggleJobsButton}
            </div>
            <div>
                {jobCards}
            </div>
        </div>
    )
}

export default Jobs;