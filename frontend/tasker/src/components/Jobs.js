import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api';
import JobCard from './JobCard.js';
import { UserContext } from '../helpers/UserContext';
import CreateJob from './CreateJob.js';

const Jobs = () => {

    const {user} = useContext(UserContext)

    const [jobs, setJobs] = useState([]);
    const [jobCards, setJobCards] = useState([]);
    const [showActiveUserJobs, setShowActiveUserJobs] = useState(true);
    const [showWorkerJobs, setShowWorkerJobs] = useState(false);
    const [showCreateJob, setShowCreateJob] = useState(false)
    const [currUser, setCurrUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
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
        
    }, [jobs, showActiveUserJobs, showWorkerJobs, currUser])


    useEffect(() => {
        if(jobs.length && currUser){
            setIsLoading(false);
        }
    
    }, [jobs, currUser])

    /**
    * Fetches the current user's data, filters out already applied jobs,
    * and creates JobCard components for each unapplied job in the 'jobs' list.
    *
    */
    async function createJobCards(){

        if(currUser.isWorker === true){
            // create Set from existing user applications
            const applications = new Set(currUser.applications);
            
            // sets state of jobCards based on filtering logic related to user applications
            setJobCards(jobs.map((job) => {
                
                // filter out jobs to which user has already applied
                if(!applications.has(job.id) && !showWorkerJobs) {
                    return <JobCard user={JSON.parse(user)} job={job} fetchCurrUser={fetchCurrUser} key={job.id} data-testid="jobCard-component"/>
                }
                // filter out jobs to which user has not already applied
                if(applications.has(job.id) && showWorkerJobs) {
                    return <JobCard user={JSON.parse(user)} job={job} fetchCurrUser={fetchCurrUser} key={job.id} data-testid="jobCard-component"/>
                }
            }));

        } else {

            // sets state of jobCards based on filtering logic for jobs posted by user
            setJobCards(jobs.map((job) => {
                
                // filter out jobs not posted by user -> show 'pending' status jobs
                if(job.postedBy === currUser.id && job.status === 'pending' && !showActiveUserJobs) {
                    return <JobCard user={JSON.parse(user)} job={job} fetchCurrUser={fetchCurrUser} key={job.id} data-testid="jobCard-component"/>
                }
                // filter out pending jobs -> show 'active' status jobs
                if(job.postedBy === currUser.id && job.status === 'active' && showActiveUserJobs) {
                    return <JobCard user={JSON.parse(user)} job={job} fetchCurrUser={fetchCurrUser} key={job.id} data-testid="jobCard-component"/>
                }
            }));
        }

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
        setShowActiveUserJobs(!showActiveUserJobs);
    }

    /** Inverts the state of showWorkerJobs 
     * 
     * Sets state of showWorkerJobs
    */
    const toggleWorkerJobs = () => {
        setShowWorkerJobs(!showWorkerJobs);
    }

    // conditionally renders a button element depending on isWorker property of user
    const toggleJobsButton = JSON.parse(user).isWorker === true
        ? 
        <button data-testid="jobs-worker-button" onClick={toggleWorkerJobs}>{showWorkerJobs ? 'All Jobs' 
        : 
        'My Jobs'}</button>
        : 
        <button data-testid="jobs-user-button" onClick={toggleUserJobs}>{showActiveUserJobs ? 'Pending Jobs' 
        : 
        'Active Jobs'}</button>;

    
    const toggleCreateJob = () => {
        setShowCreateJob(!showCreateJob);
    }

    

    // conditionally renders header depending on isWorker property of user
    const userHeader = JSON.parse(user).isWorker === true
    ?
    <h1 data-testid="jobs-worker-title">{showWorkerJobs ? 'My Jobs' : 'All Jobs'}</h1>
    :
    <h1 data-testid="jobs-user-title">{showActiveUserJobs ? 'Active Jobs' : 'Pending Jobs'}</h1>;


    // create job button only rendered for users
    const createJobButton = JSON.parse(user).isWorker === false 
    ? 
    <button data-testid="jobs-create-job-button" onClick={toggleCreateJob}>Create New Job</button>
    :
    "";

    if(isLoading){
        return (<div>loading...</div>)
    }


    return (
        <div>
            <div>
                {userHeader}
            </div>
            <div>
                {createJobButton}
            </div>
            <div>
                {showCreateJob && ( 
                    <CreateJob toggleCreateJob={toggleCreateJob}/> 
                )}
            </div>
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