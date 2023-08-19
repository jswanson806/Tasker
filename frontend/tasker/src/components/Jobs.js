import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api';
import JobCard from './JobCard.js';
import { UserContext } from '../helpers/UserContext';
import CreateJob from './CreateJob.js';

const Jobs = () => {

    const jobCardsInitialState = [];

    const {user} = useContext(UserContext)

    const [jobs, setJobs] = useState([]);
    const [jobCards, setJobCards] = useState(jobCardsInitialState);
    const [showUserJobs, setShowUserJobs] = useState(false);
    const [showAvailableJobs, setShowAvailableJobs] = useState(false);
    const [showWorkerJobs, setShowWorkerJobs] = useState(false);
    const [showCreateJob, setShowCreateJob] = useState(false)
    const [showPendingReviewJobs, setShowPendingReviewJobs] = useState(false);
    const [showAppliedJobs, setShowAppliedJobs] = useState(false);
    const [currUser, setCurrUser] = useState(null);
    const [header, setHeader] = useState('');
    const [buttons, setButtons] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    /** On initial render, calls functions to set state of currUser and jobs
     * 
     *  Sets inital view toggle based on user isWorker property
     */
    useEffect(() => {
        // parsed user string received from user context
        const parsedUser = JSON.parse(user);

        // call api to get user from db and set state of currUser
        fetchCurrUser(parsedUser.id);

        // set initial view toggle based on user isWorker property
        if(parsedUser.isWorker) {
            setShowAvailableJobs(true);
        } else {
            setShowUserJobs(true);
        }
        
    }, []);


    /** Calls functions to create and set job cards, set header, and set state of isLoading
     *  
     * Waits for jobs and currUser to be populated
     * 
    */
    useEffect(() => {

        // only call once jobs and user have been populated
        if(jobs.length && currUser) {
            // create the job cards
            createJobCards();
            // set the page header
            setHeader(renderHeader());
            setButtons(renderButtons(currUser));
            // set isLoading to false
            setIsLoading(false);
        }

        // no jobs were returned when toggling own jobs, reset jobCards to initial state
        if(!jobs.length && (showWorkerJobs || showUserJobs || showPendingReviewJobs)) {
            setJobCards(jobCardsInitialState);
            setHeader(renderHeader());
        }
        
    }, [
        jobs, 
        currUser
    ]);

    /** Calls function to fetch, filter, and set state of jobs 
     * 
     * Uses switch statement to check status of view toggles and set data object properties for filtering logic
    */
    useEffect(() => {

        // if user and jobs are populated
        if(currUser){

            // variable holds object containing filter parameters
            let data;

            // uses toggled state to determine filter parameters 
            switch(true){
                case showUserJobs:
                    data = {
                        posted_by: currUser.id
                    };
                    break;
                case showWorkerJobs:
                    data = {
                        status: 'active',
                        assigned_to: currUser.id
                    };
                    break;
                case showAppliedJobs:
                case showAvailableJobs:
                    data = {
                        status: 'pending'
                    };
                    break;
                case showPendingReviewJobs:
                    data = {
                        status: 'pending review',
                        posted_by: currUser.id
                    };
                    break;
                default:
                    data = null;
                    break;
            }
            // fetches jobs from database with filter parameters
            fetchAndSetFilteredJobs(data);
        }

    }, [
        currUser,
        showUserJobs, 
        showWorkerJobs, 
        showPendingReviewJobs,
        showAppliedJobs,
        showAvailableJobs
    ]);

    /**
    * Sets state of JobCards based on current view toggles.
    * 
    * Uses filtering based on the current user, view toggle states, and existing filtered jobs to map JobCard components to jobCards state
    * 
    */
    async function createJobCards(){

        // create Set from existing user applications
        const applications = new Set(currUser.applications);

        if(currUser.isWorker === true) {
            

            // sets state of jobCards based on filtering logic related to user applications
            setJobCards(jobs.map((job) => {
                // show the jobs that are 'pending' status
                if (showAvailableJobs) {
                    return <JobCard user={currUser} applications={applications} job={job} fetchCurrUser={fetchCurrUser} key={job.id} data-testid="jobCard-component"/>

                // show the jobs that are 'pending' and to which the user has applied
                } else if(showAppliedJobs && applications.has(job.id)) {
                    return <JobCard user={currUser} applications={applications} job={job} fetchCurrUser={fetchCurrUser} key={job.id} data-testid="jobCard-component"/>

                // show the jobs assigned to the worker and not 'complete'
                } else if(showWorkerJobs && job.status !== 'complete') {
                    return <JobCard user={currUser} applications={applications} job={job} fetchCurrUser={fetchCurrUser} key={job.id} data-testid="jobCard-component"/>
                };
            }));

        } else { // user is not a worker

            // sets state of jobCards based on filtering logic for jobs posted by user
            setJobCards(jobs.map((job) => {
                // show the jobs that user posted but are not yet 'pending review' or 'complete
                if(showUserJobs && (job.status === 'pending' || job.status === 'active')) {
                    return <JobCard user={currUser} job={job} applications={applications} fetchCurrUser={fetchCurrUser} key={job.id}data-testid="jobCard-component"/>
                // show the jobs that are 'pending review'
                } else if (showPendingReviewJobs) {
                    return <JobCard user={currUser} job={job} applications={applications} fetchCurrUser={fetchCurrUser} key={job.id}data-testid="jobCard-component"/>
                };
            }));
        };
    };


    /**
    * Fetches data for a single user from the Tasker API based on the given ID.
    *
    * @async
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
            console.error(err);
        }
    }

    /**
    * Fetches data for jobs matching filter(s) passed as an argument
    *
    * @async
    * @param {object} filters - Object containing filter parameters
    * @returns {Promise<object>} A Promise that resolves with the jobs data as an object.
    * @throws {Error} If there's an error during the API call or the user data cannot be retrieved.
    */
    async function fetchAndSetFilteredJobs(filters) {
        try {
            const filteredRes = await TaskerApi.findAndFilterJobs(filters);
            const { jobs } = filteredRes;
            setJobs(jobs);
        } catch(err) {
            console.error(err);
        }
    }

    const toggleUserJobs = () => {
        setShowWorkerJobs(false);
        setShowPendingReviewJobs(false);
        setShowCreateJob(false);
        setShowAppliedJobs(false);
        setShowAvailableJobs(false);

        setShowUserJobs(true);
    }

    const toggleWorkerJobs = () => {
        setShowUserJobs(false);
        setShowPendingReviewJobs(false);
        setShowCreateJob(false);
        setShowAppliedJobs(false);
        setShowAvailableJobs(false);

        setShowWorkerJobs(true);
    }

    const toggleAvailableJobs = () => {
        setShowUserJobs(false);
        setShowPendingReviewJobs(false);
        setShowCreateJob(false);
        setShowAppliedJobs(false);
        setShowWorkerJobs(false);

        setShowAvailableJobs(true);

    }

    const toggleAppliedJobs = () => {
        setShowUserJobs(false);
        setShowPendingReviewJobs(false);
        setShowCreateJob(false);
        setShowWorkerJobs(false);
        setShowAvailableJobs(false);

        setShowAppliedJobs(true);
    }

    const togglePendingReviewJobs = () => {
        setShowWorkerJobs(false);
        setShowUserJobs(false);
        setShowCreateJob(false);
        setShowAppliedJobs(false);
        setShowAvailableJobs(false);

        setShowPendingReviewJobs(true);
    }

    const toggleCreateJob = () => {
        setShowWorkerJobs(false);
        setShowUserJobs(false);
        setShowPendingReviewJobs(false);
        setShowAppliedJobs(false);
        setShowAvailableJobs(false);

        setShowCreateJob(true);
    }


    const renderHeader = () => {
        // check isWorker property of currUser and render different headers based on state values
        if(currUser.isWorker) {
            if(showWorkerJobs){ // shows jobs to which worker has been assigned
                return <h1 data-testid="jobs-my-worker-jobs-title">My Jobs</h1>

            } else if(showAppliedJobs){ // shows jobs to which worker has applied and are pending
                return <h1 data-testid="jobs-applied-worker-jobs-title">Applications</h1>

            } else { // shows all pending jobs
                return <h1 data-testid="jobs-available-worker-jobs-title">Available Jobs</h1>
            }

        } else { // user is not a worker

            if(showUserJobs) { // show jobs user created
                return <h1 data-testid="jobs-my-jobs-user-title">My Jobs</h1>
            } else { // show completed jobs which the user created
                return <h1 data-testid="jobs-completed-jobs-user-title">Pending Review</h1>
            }
        }
    }


    const renderButtons = (currUser) => {
        if(currUser.isWorker) {
            return (
                <div>
                    <button data-testid="jobs-worker-available-button" onClick={toggleAvailableJobs}>Available Jobs</button>
                    <button data-testid="jobs-worker-applications-button" onClick={toggleAppliedJobs}>Applications</button>
                    <button data-testid="jobs-worker-my-jobs-button" onClick={toggleWorkerJobs}>My Jobs</button>
                </div>
            )
        } else {
            return (
                <div>
                    <div>
                        <button data-testid="jobs-user-my-jobs-button" onClick={toggleUserJobs}>My Jobs</button>
                        <button data-testid="jobs-user-completed-button" onClick={togglePendingReviewJobs}>Pending Review</button>

                    </div>
                    <div>
                        {showUserJobs && (<button data-testid="jobs-create-job-button" onClick={toggleCreateJob}>Create New Job</button>)}
                    </div>
                </div>
            )
        }
    }


    if(isLoading){
        return (<div>loading...</div>)
    }

    return (
        <div className="jobs-container">

            <div className="jobs-header-container">
                {header}
            </div>

            <div className="jobs-buttons-container">
                {buttons}
            </div>

            {showCreateJob && ( 
                <CreateJob toggleCreateJob={toggleCreateJob}/> 
            )}

            {!showCreateJob && (
                <div className="jobs-cards-container">
                    {jobCards}
                </div>
            )}
        </div>
    )
}

export default Jobs;