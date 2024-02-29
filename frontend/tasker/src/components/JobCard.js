import React, { useEffect, useState } from 'react';
import JobDetails from './JobDetails.js';
import JobCompletionForm from './JobCompletionForm.js';
import TaskerApi from '../api.js';
import { Modal, Card, CardTitle, Badge, CardText, Col } from 'reactstrap';

const JobCard = ({user, applications, job, getCurrUser, triggerEffect}) => {

    const [showCompletionForm, setShowCompletionForm] = useState(false);
    const [currJob, setCurrJob] = useState(job);
    const [modal, setModal] = useState(false);

    /** Updates state of modal to hide the Modal containing JobDetails */
    const toggleDetails = () => {
        setModal(!modal);
    };

    /** Calls api to apply to a job
     * 
     * Hides the Modal
     * 
     * Calls getCurrUser from Jobs component, triggering useEffect to refresh the jobCards
     */
    const applyToJob = async (user_id, job_id) => {
        try {
            // call api to apply to job
            await TaskerApi.applyToJob(user_id, job_id);
            // hide the Modal
            toggleDetails();
            // refresh user info to get latest applications list
            await getCurrUser(user_id);
            
        } catch(err) {
            console.error('Error: ', err)
        }
    }

    /** Calls api to withdraw an application from a job
     * 
     * Hides the Modal
     * 
     * Calls getCurrUser from Jobs component, triggering useEffect to refresh the jobCards
     */
    const withdrawApplication = async (user_id, job_id) => {
        try {
            // call api to withdraw application
            await TaskerApi.withdrawApplication(user_id, job_id);
            // hide the Modal
            toggleDetails();
            // refresh user info to get latest user applications list
            // this will trigger useEffect in Jobs component and refresh the job cards
            await getCurrUser(user_id)

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    /** Calls api to update start time of job in database 
     * 
     * Updates currJob state with the updated job info
     * 
     * Uses triggerEffect from Jobs component to trigger useEffect,
     *  which changes which jobs are displayed based on filter parameters
    */
    const startWork = async (job) => {
        try {
            // initialize new Date object
            const currentTime = new Date();
            // options for toLocalString
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric'
            }
            // create the partial update info for the job
            const jobInfo = {job: 
                { 
                    id: job.id,
                    start_time: currentTime.toLocaleString(undefined, options),
                    status: 'in progress'
                }};

            // call api to update job
            const updatedJob = await TaskerApi.updateSingleJob(jobInfo);
            // update currJob state with updated job
            setCurrJob(updatedJob);
            // call triggerEffect from Jobs component to trigger filtering logic
            triggerEffect();

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    /** Hides open Modals and triggers filtering logic in Jobs component for displayed jobs
     * 
     * Hides the Modal containing the JobCompletionForm 
     * 
     * Hides the Modal containing the JobDetails
     * 
     * Passed as prop to the JobCompletionForm as 'onUpload' and triggered upon submission of
     *  the JobCompletionForm
     * */

    const endWork = () => {
        // hide the completion form
        setShowCompletionForm(false);
        // hide the details component
        toggleDetails();
        // refresh the jobs list by triggering useEffect in parent component 'Jobs'
        triggerEffect();
    }
    
    /** Handles updating the job in the database upon final review and creates checkout session
     * 
     * Creates partial job update object and calls api to update job
     * 
     * updates the state of currJob to the updated job info
     * 
     * Calls api to create Stripe checkout session and navigates to checkout page
     * 
     * Passed as prop to JobDetails as onJobComplete and triggered upon user clicking the 'Review' Button
     */
    const completeAndPay = async (job) => {
        try {
            // partial job update info
            const jobInfo = { job: { 
                id: job.id, 
                status: 'complete'
            }};
            // call api to update job
            const jobUpdateRes = await TaskerApi.updateSingleJob(jobInfo);
            // update state of currJob with updated job info
            setCurrJob(jobUpdateRes)
            // call api to create Stripe checkout session
            const res = await TaskerApi.createCheckoutSession({job: {...currJob}});
            // navigate to the premade checkout page url
            window.location.href = res.url;
        } catch(err) {
            console.error(err);
        }
    }

    /** Renders badge showing count of applicants for a job */
    const renderApplicantBadge = (job, user) => {
        // display only to users (not workers) when job applicants array has values and the job is not assigned to a worker
        if(!user.isWorker && job.applicants[0] && !job.assigned_to) {
            return (
                <Badge 
                    color="warning" 
                    pill
                >
                    Applicants: {job.applicants.length}
                </Badge>
            )
        }
        return;
    }

    /** Renders badge showing applied status to a worker who has already applied to the job */
    const renderAppliedBadge = (job, applications) => {
        // display only if workers applications contains this job id and the status of the job is still pending
        if(applications.has(job.id) && job.status === 'pending'){
            return(
                <div className="jobCard-badge">
                    <Badge 
                        color="success" 
                        style={{padding: '5px'}}
                    >
                        Applied
                    </Badge>
                </div>
            )
        }
        return;
    }

    /** Renders badge showing the current status of the job */
    const renderJobStatusBadge = (job) => {
        // worker has not applied and the job statys is still pending
        if(!applications.has(job.id) && job.status === 'pending') {
            return (
                <Badge 
                    color="info" 
                    style={{padding: '5px'}}
                >
                    {job.status}
                </Badge>
            )
        // job status is active
        } else if (job.status === 'active') {
            return (
                <Badge 
                    color="success" 
                    style={{padding: '5px'}}
                >
                    {job.status}
                </Badge>                
            )
        // job status is pending review
        } else if(job.status === 'pending review') {
            return (
                <Badge 
                    color="warning" 
                    style={{padding: '5px'}}
                >
                    {job.status}
                </Badge> 
            )
        }
        
    }

    // variable to hold applicant badges and render in JSX
    const applicantBadge = renderApplicantBadge(job, user);
    // variabel to hold applied badges and render in JSX
    const appliedBadge = renderAppliedBadge(job, applications);
    // variable to hold job status badges and render in JSX
    const statusBadge = renderJobStatusBadge(job);

    return (
        
        <Col sm="5" >
            <Card 
                body
                className="text-center"
                style={{
                    width: '15rem'
                }}
                onClick={toggleDetails}
              >
                <div>
                    {applicantBadge}
                </div>
                    
                <div className="jobCard-card">
                    <CardTitle tag="h5">{job.title}</CardTitle>
                    {appliedBadge}
                    {statusBadge}
                    <CardText>{job.body.slice(0,30) + "..."}</CardText>
                </div>
          
                {/* JobDetails component as a pop-up based on showDetails status */}
                <Modal 
                    isOpen={modal} 
                    toggle={() => setModal(!modal)} 
                    style={{position: "relative", marginTop: "20%"}}
                >
                    <JobDetails 
                        job={job} 
                        applications={applications} 
                        user={user} 
                        withdrawApplication={withdrawApplication}
                        startWork={startWork} 
                        onEndWork={() => setShowCompletionForm(true)}
                        applyToJob={applyToJob}
                        toggleDetails={toggleDetails}
                        triggerEffect={triggerEffect}
                        onJobComplete={() => completeAndPay(currJob)}
                    />                
                </Modal>
                {/* Job completion form */}
                <Modal 
                    isOpen={showCompletionForm}
                    toggle={() => setShowCompletionForm(!showCompletionForm)}
                    style={{position: "relative", marginTop: "20%"}}    
                >
                    <div data-testid="jobCompletion-form-container">
                        <JobCompletionForm 
                            job={currJob} 
                            onUpload={() => endWork()}
                        />
                    </div>
                </Modal>
            </Card>
        </Col>
        
        
    )
}

export default JobCard;