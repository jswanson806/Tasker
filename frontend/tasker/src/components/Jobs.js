import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api';
import JobCard from './JobCard.js';
import { UserContext } from '../helpers/UserContext';
import CreateJob from './CreateJob.js';
import {Row, Spinner, Button, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Col, Modal} from "reactstrap";
import "./styles/Jobs.css";

const Jobs = () => {

    const jobCardsInitialState = [];
    const jobsInitialState = '';

    const {user} = useContext(UserContext)

    const [jobs, setJobs] = useState(jobsInitialState);
    const [jobCards, setJobCards] = useState(jobCardsInitialState);
    const [currUser, setCurrUser] = useState(null);
    const [header, setHeader] = useState('Jobs');
    const [buttons, setButtons] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [triggerEffect, setTriggerEffect] = useState(false);

    // filtering toggles
    const [showUserJobs, setShowUserJobs] = useState(false);
    const [showAvailableJobs, setShowAvailableJobs] = useState(false);
    const [showWorkerJobs, setShowWorkerJobs] = useState(false);
    const [showCreateJob, setShowCreateJob] = useState(false)
    const [showPendingReviewJobs, setShowPendingReviewJobs] = useState(false);
    const [showAppliedJobs, setShowAppliedJobs] = useState(false);
    
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
        if(jobs !== jobsInitialState && currUser) {
            // create the job cards
            createJobCards();
            // set the page header
            setHeader(renderHeader());
            // set buttons
            setButtons(renderButtons());
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

        // if currUser is populated & create job form is not shown, run switch statement
        if(currUser && !showCreateJob){

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
        triggerEffect,
        showUserJobs, 
        showWorkerJobs, 
        showPendingReviewJobs,
        showAppliedJobs,
        showAvailableJobs
    ]);

    
    
    // Function to determine the correct job value to return based on toggles and job status
    function getJobToShow(job, applications) {
        
        if (showAvailableJobs) {
            return job;
        } else if (showAppliedJobs && applications.has(job.id)) {
            return job;
        } else if (showWorkerJobs && job.status !== 'complete') {
            return job;
        } else if (showUserJobs && (job.status === 'pending' || job.status === 'active')) {
            return job;
        } else if (showPendingReviewJobs) {
            return job;
        }

        return null;
    }

    /**
    * Sets state of JobCards based on current view toggles.
    * 
    * Uses filtering based on the current user, view toggle states, and existing filtered jobs to map JobCard components to jobCards state
    * 
    */
    async function createJobCards(){

        // create Set from existing user applications
        const applications = new Set(currUser.applications);

        setJobCards(
            jobs.map((job) => {
                const shouldShow =
                    (showAvailableJobs) ||
                    (showAppliedJobs) ||
                    (showWorkerJobs) ||
                    (showUserJobs) ||
                    (showPendingReviewJobs);

                // hold return value which will be a job object or null
                let currJob = getJobToShow(job, applications);

                // if shouldShow and currJob is truthy, return the job card passing returned job object as prop 'job'
                if (shouldShow && currJob) {
                    return (
                        <Col key={job.id}>
                            <JobCard
                                user={currUser}
                                applications={applications}
                                job={currJob}
                                fetchCurrUser={fetchCurrUser}
                                setJobs={setJobs}
                                key={job.id}
                                triggerEffect={() => setTriggerEffect(!triggerEffect)}
                                data-testid="jobCard-component"
                            />
                        </Col>

                )};
            })
        );
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

    const resetStates = () => {
        setShowWorkerJobs(false);
        setShowPendingReviewJobs(false);
        setShowCreateJob(false);
        setShowAppliedJobs(false);
        setShowAvailableJobs(false);
        setShowUserJobs(false);
    }


    const toggleUserJobs = () => {
        resetStates();
        setShowUserJobs(true);
    }

    const toggleWorkerJobs = () => {
        resetStates();
        setShowWorkerJobs(true);
    }

    const toggleAvailableJobs = () => {
        resetStates();
        setShowAvailableJobs(true);
    }

    const toggleAppliedJobs = () => {
        resetStates();
        setShowAppliedJobs(true);
    }

    const togglePendingReviewJobs = () => {
        resetStates();
        setShowPendingReviewJobs(true);
    }

    const toggleCreateJob = () => {
        resetStates();
        setShowCreateJob(true);
    }


    const renderHeader = () => {
        // check isWorker property of currUser and render different headers based on state values
        if(currUser.isWorker) {
            if(showWorkerJobs){ // shows jobs to which worker has been assigned
                return <h3 data-testid="jobs-my-worker-jobs-title">My Jobs</h3>

            } else if(showAppliedJobs){ // shows jobs to which worker has applied and are pending
                return <h3 data-testid="jobs-applied-worker-jobs-title">Applications</h3>

            } else { // shows all pending jobs
                return <h3 data-testid="jobs-available-worker-jobs-title">Available Jobs</h3>
            }

        } else { // user is not a worker

            if(showUserJobs) { // show jobs user created
                return <h3 data-testid="jobs-my-jobs-user-title">My Jobs</h3>
            } else { // show completed jobs which the user createdh3
                return <h3 data-testid="jobs-completed-jobs-user-title">Pending Review</h3>
            }
        }
    }


    const renderButtons = () => {
        if(currUser.isWorker) { // buttons for workers
            return (
                <div>
                    <ButtonGroup>
                        <UncontrolledDropdown>
                            <DropdownToggle color="info" caret >
                                Sort
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={toggleAvailableJobs} data-testid="available-jobs-menu-item">
                                    Available Jobs
                                </DropdownItem>
                                <DropdownItem onClick={toggleAppliedJobs} data-testid="applications-menu-item">
                                    Applications
                                </DropdownItem>
                                <DropdownItem onClick={toggleWorkerJobs} data-testid="my-jobs-menu-item">
                                    My Jobs
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </ButtonGroup>
                </div>
            )
        } else { // buttons for users
            return (
                <div>
                    <ButtonGroup>
                        <UncontrolledDropdown>
                            <DropdownToggle color="info" caret >
                                Sort
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={toggleUserJobs} data-testid="my-jobs-menu-item">
                                    My Jobs
                                </DropdownItem>
                                <DropdownItem onClick={togglePendingReviewJobs} data-testid="pending-review-menu-item">
                                    Pending Review
                                </DropdownItem>
                                
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </ButtonGroup>
                    <Button 
                        className="jobs-button" 
                        color="info" 
                        data-testid="jobs-create-job-button" 
                        onClick={toggleCreateJob}
                    >
                        Create New Job
                    </Button>
                </div>
            )
        }
    }


    if(isLoading){
        return (
        <div>
            <Spinner>
                Loading...
            </Spinner>
        </div>
          )
    }

    return (
        <div className="jobs-container">

            <div className="jobs-header-container">
                {header}
            </div>

            {!showCreateJob && (
                <div className="jobs-buttons-container">
                    {buttons}
                </div>
            )}
                
            <Modal 
                isOpen={showCreateJob} 
                toggle={() => setShowCreateJob(true)} 
                style={{position: "relative", marginTop: "20%"}}
            >
                <CreateJob onCreate={() => 
                    {
                        toggleUserJobs(); 
                        setTriggerEffect(!triggerEffect);
                    }}
                    onClose={() => 
                    {
                        toggleUserJobs();
                    }}
                /> 
            
            </Modal>
            
            {!showCreateJob && (
                <div className="jobs-jobCard-container">
                    <Row md="4" sm="1" >
                        {jobCards}
                    </Row>
                </div>
            )}
        </div>
    )
}

export default Jobs;