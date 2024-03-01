import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api';
import JobCard from './JobCard.js';
import { UserContext } from '../helpers/UserContext';
import CreateJob from './CreateJob.js';
import {
    Row, 
    Spinner, 
    Button, 
    ButtonGroup, 
    UncontrolledDropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem, 
    Col, 
    Modal
} from "reactstrap";
import "./styles/Jobs.css";

const Jobs = () => {

    const jobCardsInitialState = [];
    const jobsInitialState = '';

    const {user} = useContext(UserContext)

    const [jobs, setJobs] = useState(jobsInitialState);
    const [jobCards, setJobCards] = useState(jobCardsInitialState);
    const [currUser, setCurrUser] = useState(null);
    const [header, setHeader] = useState('');
    const [buttons, setButtons] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [triggerEffect, setTriggerEffect] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // view toggles
    const [isWorker, setIsWorker] = useState(false);
    const [showCreateJob, setShowCreateJob] = useState(false);
    
    /** On initial render
     * 
     *  Calls functions to set state of currUser
     *  Gets the current user from the database
     */
    useEffect(() => {
        // parsed user string received from user context
        const parsedUser = JSON.parse(user);
        // call api to get user from db and set state of currUser
        getCurrUser(parsedUser.id);
        
    }, []);

    
    /** Sets the default content for the page depending on isWorker boolean from the currUser state
     * 
     * Calls API for initial list of jobs
     */
    useEffect(() => {
        
        // if currUser is populated & create job form is not shown
        if(currUser && !showCreateJob){

            if(!isWorker){ // if user is not worker, get the in progress jobs for this user
                getAndSetActiveUserJobs(currUser.id);
                // set buttons for users
                setButtons(renderUserButtons());
                renderHeader('My Active Jobs');
            } else { // else the user is a worker, get all available jobs
                getAndSetAllAvailableJobs();
                // set buttons for workers
                setButtons(renderWorkerButtons());
                renderHeader('Available Jobs');
            }
        }

    }, [
        currUser,
        isWorker,
        triggerEffect
    ]);


    /** Calls functions to create and set job cards, set header, and set state of isLoading
     *  
     * Waits for jobs and currUser to be populated
     * 
    */
    useEffect(() => {

        // only call once jobs and currUser have been populated
        if(jobs !== jobsInitialState && currUser) {
            // create the job cards
            createJobCards();
            setNotFound(false);
            
        } else {
            setNotFound(true);
        }
        setIsLoading(false);
        
    }, [ jobs, currUser ]);



    /**
    * Fetches data for a single user from the Tasker API based on the given ID.
    *
    * Updates state of currUser with the response object
    * Updates isWorker with the isWorker property of the response object
    */
    async function getCurrUser(id){
        try {
            const res = await TaskerApi.getSingleUser(id);
            const { user } = res;
            setCurrUser(user);
            setIsWorker(user.isWorker);
        
        } catch(err) {
            console.error(err);
        }
    }

    /**
    * Sets state of JobCards based on current view toggles.
    * 
    * Uses filtering based on the current user, view toggle states, and existing filtered jobs to map JobCard components to jobCards state
    * 
    */
    async function createJobCards(){
        // convert user applications to Set
        const applications = new Set(currUser.applications);
        // map each job to a JobCard componenet
        const jobCards = jobs.map((job) => {
            return (
                <Col key={job.id}>
                    <JobCard
                        user={currUser}
                        applications={applications}
                        job={job}
                        getCurrUser={getCurrUser}
                        setJobs={setJobs}
                        key={job.id}
                        triggerEffect={() => setTriggerEffect(!triggerEffect)}
                        data-testid="jobCard-component"
                    />
                </Col>
            );
        });

        setJobCards(jobCards);
    };

    /** 
     * Fetches data for jobs posted by the user where the job status is 'active'
     * 
     * Calls api to findInProgressUserJobs
     * 
     * Updates state of jobs with the response array of jobs
     */
    async function getAndSetActiveUserJobs(userId){
        setIsLoading(true);
        try {
            const inProgressUserJobs = await TaskerApi.getActiveUserJobs(userId);
            if(!inProgressUserJobs.jobs) {
                setJobs(jobsInitialState);
            } else {
                const { jobs } = inProgressUserJobs;
                setJobs(jobs);
            };
        } catch(err) {
            console.error(err);
        }
    }

    /**
     * Fetches data for jobs posted by the user where the job status is 'pending review'
     * 
     * Calls api to findPendingReviewUserJobs
     * 
     * Updates state of jobs with the response array of jobs
    */
    async function getAndSetPendingReviewUserJobs(userId){
        setIsLoading(true);
        try {
            const allPendingReviewUserJobs = await TaskerApi.getPendingReviewUserJobs(userId);
            if(!allPendingReviewUserJobs.pendingReviewUserJobs) {
                setJobs(jobsInitialState);
            } else {   
                const { pendingReviewUserJobs } = allPendingReviewUserJobs;
                setJobs(pendingReviewUserJobs);
            }
        } catch(err) {
            console.error(err);
        }
    }

    /**
     * Fetches data for jobs available for applications by workers
     * 
     * Calls api to findAllAvailableJobs
     * 
     * Updates state of jobs with the response array of jobs
    */
    async function getAndSetAllAvailableJobs(){
        setIsLoading(true);
        try {
            const allAvailableJobs = await TaskerApi.getAllAvailableJobs();
            const { allJobs } = allAvailableJobs;
            setJobs(allJobs);
        } catch(err) {
            console.error(err);
        }
    }

    /**
     * Fetches data for jobs to which worker has already applied
     * 
     * Calls api to findAllAppliedWorkerJobs
     * 
     * Updates state of jobs with the response array of jobs
    */
    async function getAndSetAllAppliedWorkerJobs(workerId){
        setIsLoading(true);
        try {
            const allAppliedJobs = await TaskerApi.getAppliedWorkerJobs(workerId);
            if(!allAppliedJobs.appliedJobs){
                setJobs(jobsInitialState);
            } else {
                const { appliedJobs } = allAppliedJobs;
                setJobs(appliedJobs);
            }
        } catch(err) {
            console.error(err);
        }
    }

    /**
     * Fetches data for jobs to which worker has already been assigned
     * 
     * Calls api to findAllInProgressWorkerJobs
     * 
     * Updates state of jobs with the response array of jobs
    */
    async function getAndSetAllAssignedWorkerJobs(workerId){
        setIsLoading(true);
        try {
            const allAssignedWorkerJobs = await TaskerApi.getAllAssignedWorkerJobs(workerId);
            if(!allAssignedWorkerJobs.assignedJobs){
                setJobs(jobsInitialState);
            } else {
                const { assignedJobs } = allAssignedWorkerJobs;
                setJobs(assignedJobs);
            }
        } catch(err) {
            console.error(err);
        }
    }
 
    const toggleCreateJob = () => {
        setShowCreateJob(true);
    }

    const renderHeader = (pageHeader) => {
        setHeader(<h2 className="jobs-dynamic-page-header">{pageHeader}</h2>)
    }


    const renderWorkerButtons = () => {
        return (
            <div>
                <ButtonGroup>
                    <UncontrolledDropdown>
                        <DropdownToggle color="info" caret >
                            Sort
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {
                                    getAndSetAllAvailableJobs();
                                    renderHeader('Available Jobs');
                                }} data-testid="available-jobs-menu-item">
                                Available Jobs
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                    getAndSetAllAppliedWorkerJobs(currUser.id);
                                    renderHeader('My Applications');
                                }} data-testid="applications-menu-item">
                                Applications
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                    getAndSetAllAssignedWorkerJobs(currUser.id);
                                    renderHeader('My Assigned Jobs');
                                }} data-testid="my-jobs-menu-item">
                                My Jobs
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </ButtonGroup>
            </div>
        );
    };
        
    const renderUserButtons = () => { // buttons for users
        return (
            <div>
                <ButtonGroup>
                    <UncontrolledDropdown>
                        <DropdownToggle color="info" caret >
                            Sort
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {
                                    getAndSetActiveUserJobs(currUser.id);
                                    renderHeader('My Active Jobs');
                                }} data-testid="my-jobs-menu-item">
                                Active Jobs
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                    getAndSetPendingReviewUserJobs(currUser.id);
                                    renderHeader('Jobs Pending Review');
                                }} data-testid="pending-review-menu-item">
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
        );
    };


    // default state of page shows spinner when isLoading is true
    if(isLoading){
        return (
        <div className="spinner">
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
                <CreateJob 
                    onCreate={() => 
                    {
                        setTriggerEffect(!triggerEffect);
                        setShowCreateJob(false);
                    }}
                    onClose={() => 
                    {
                        setShowCreateJob(false);
                        setTriggerEffect(!triggerEffect)
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

            {notFound && (
                <span className="jobs-notFound-message">It looks like no jobs were found.</span>
            )}
        </div>
    )
}

export default Jobs;