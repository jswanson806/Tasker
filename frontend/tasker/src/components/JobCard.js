import React, { useState } from 'react';
import JobDetails from './JobDetails.js';
import JobCompletionForm from './JobCompletionForm.js';
import TaskerApi from '../api.js';

const JobCard = ({user, applications, job, fetchCurrUser}) => {

    const [showDetails, setShowDetails] = useState(false);
    const [showCompletionForm, setShowCompletionForm] = useState(false);
    const [showApplicantList, setShowApplicantList] = useState(false);
    const [jobStarted, setJobStarted] = useState(false);
    const [applicantList, setApplicantList] = useState('');

    const toggleDetails = () => {
        setShowDetails(!showDetails);
        setShowApplicantList(false)
    };

    const applyToJob = async (user_id, job_id) => {
        try {
            await TaskerApi.applyToJob(user_id, job_id);
            toggleDetails();
            await fetchCurrUser(user_id);
            
        } catch(err) {
            console.error('Error: ', err)
        }
    }

    // ******************************NEED TO TEST LOGIC*********************************************
    const withdrawApplication = async (user_id, job_id) => {
        try {
            toggleDetails();

            await TaskerApi.withdrawApplication(user_id, job_id);
            toggleDetails();
            await fetchCurrUser(user_id)

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    
    const startWork = async (job) => {
        try {
            const currentTime = new Date();

            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric'
            }

            job.startTime = currentTime.toLocaleString(undefined, options);

            await TaskerApi.updateSingleJob(job);
            setJobStarted(true);

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    const endWork = async (job) => {
        try {
            const currentTime = new Date();

            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric'
            }

            job.endTime = currentTime.toLocaleString(undefined, options);

            await TaskerApi.updateSingleJob(job);

            setShowCompletionForm(true);
            setJobStarted(false);

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    /** Conditionally returns button elements depending on isWorker property of user object 
     * 
     * Buttons change based on context of user's relationship with the job
     * 
     * @example applied and job is pending -> Withdraw and Close buttons present
     * 
    */
    const renderDetails = (applications) => {

        if(user.isWorker) {
            return (
                <div className="jobDetails-card" data-testid="jobDetails-card">
                    <JobDetails job={job} key={job.id}/>
                
                    {/* apply button shows on jobs that have not yet been applied to */}
                    {!applications.has(job.id) && (
                        <button data-testid="jobDetails-apply-button" onClick={() => applyToJob(user.id, job.id)}>Apply</button>
                    )}

                    {/* if job has been applied to, apply button is unapply */}
                    {applications.has(job.id) && job.status === 'pending' && (
                        <button data-testid="jobDetails-withdraw-button" onClick={() => withdrawApplication(user.id, job.id)}>Withdraw</button>
                    )}

                    {/* show start and end work button on jobs that are assigned to user */}
                    {job.assignedTo === user.id && (
                        <div className="jobDetails-card-button-container">
                            {!jobStarted && (<button data-testid="jobDetails-start-button" onClick={() => startWork(job)}>Start Work</button>)}
                            {jobStarted && (<button data-testid="jobDetails-end-button" onClick={() => endWork(job)}>End Work</button>)}
                        </div>
                    )}
                    
                    <button data-testid="jobDetails-close-button" onClick={toggleDetails}>Close</button>
                </div>
            )
        } else {
            return (
                <div className="jobDetails-card" data-testid="jobDetails-card">
                    <JobDetails job={job} key={job.id}/>
                    <button data-testid="jobDetails-close-button" onClick={toggleDetails}>Close</button>
                </div>
            )
        }
    }

    /** Conditionally renders status of job based on user.isWorker property
     * 
     * Shows 'Applied' if the job is still pending and the user has already applied
     */
    const getJobStatus = (applications) => {
        if(user.isWorker){
           return <h2>Status: {applications.has(job.id) ? 'Applied' : `${job.status}`}</h2>
        } else {
            return <h2>Status: {job.status}</h2>
        }
    }

    const getApplicantCount = (job) => {
        
        return <button className="jobCard-applicants-button" onClick={() => getApplicantList(job)}>{job.applicants[0] !== null ? job.applicants.length : '0'}</button>
       
    }

    const getApplicantList = async (job) => {

        if(!user.isWorker && job.applicants[0] !== null) {

            const promises = job.applicants.map(async (id) => {
                const res = await TaskerApi.getSingleUser(id);
                const { user } = res;
                return (
                    <div>
                        <button key={user.id} onClick={() => assignToJob(job.id, user.id)}>{user.firstName} {user.lastName.slice(0, 1) + "."} {user.avgRating !== null ? user.avgRating : ''}</button>
                    </div>
                );
            })

            try {

                const resultArray = await Promise.all(promises);

                setApplicantList(resultArray);
                setShowApplicantList(true);

            } catch(err) {
                console.error(err);
                return [];
            }
        }
    }

    const assignToJob = async (job_id, user_id) => {
        const data = { job: {
            id: job_id,
            assigned_to: user_id,
            status: 'active'
        }}
        await TaskerApi.updateSingleJob(data)
    }


    const showRenderDetails = renderDetails(applications);
    const showJobStatus = getJobStatus(applications);
    const showApplicantCount = getApplicantCount(job);


    return (
        
        <div className="jobCard-container">
            <button onClick={toggleDetails}>
                <div className="jobCard-card">
                    <h3>{job.title}</h3>
                    {showJobStatus}
                    <p>{job.body.slice(0,30) + "..."}</p>
                </div>
            </button>

            {/* JobDetails component as a pop-up based on showDetails status */}
            {showDetails && (
                <div className="jobDetails-container">
                    {showRenderDetails}
                    {job.status !== 'active' && (
                        <p>Applications: {showApplicantCount}</p>
                    )}
                </div>
            )}

            

            {/* list of applicants */}
            {showApplicantList && (
                <ol>
                    {applicantList}
                </ol>
            )}

            {/* Job completion form */}
            {showCompletionForm && (
                <div data-testid="jobCompletion-form-container">
                    <JobCompletionForm job={job}/>
                </div>
            )}
        </div>
    )
}

export default JobCard;