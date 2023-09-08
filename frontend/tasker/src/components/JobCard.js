import React, { useEffect, useState } from 'react';
import JobDetails from './JobDetails.js';
import JobCompletionForm from './JobCompletionForm.js';
import TaskerApi from '../api.js';

const JobCard = ({user, applications, job, fetchCurrUser, triggerEffect}) => {

    const [showDetails, setShowDetails] = useState(false);
    const [showCompletionForm, setShowCompletionForm] = useState(false);
    const [jobStarted, setJobStarted] = useState(false);
    const [isAssigned, setIsAssigned] = useState(false);

    
    useEffect(() => {
        if(job.assignedTo) {
            setIsAssigned(true);
        }
    }, [])

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const applyToJob = async (user_id, job_id) => {
        try {
            await TaskerApi.applyToJob(user_id, job_id);
            toggleDetails();
            // get the latest user information from the database
            await fetchCurrUser(user_id);
            
        } catch(err) {
            console.error('Error: ', err)
        }
    }


    const withdrawApplication = async (user_id, job_id) => {
        try {
            toggleDetails();

            await TaskerApi.withdrawApplication(user_id, job_id);
            toggleDetails();
            // get the latest user information from the database
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

            job.start_time = currentTime.toLocaleString(undefined, options);
            job.status = 'in progress';
            job.end_time = '';
            job.payment_due = 0;
            job.after_image_url = '';

            const jobInfo = {job: { ...job }};

            await TaskerApi.updateSingleJob(jobInfo);
            setJobStarted(true);

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    const endWork = async (job) => {
        try {
            const defaultPayRate = 20.00;
            const currentTime = new Date();

            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric'
            }

            job.end_time = currentTime.toLocaleString(undefined, options);

            const hoursWorked = calculateHoursWorked(job);
            const paymentDue = calculatePaymentDue(hoursWorked, defaultPayRate);
            console.log(paymentDue)

            job.payment_due = +paymentDue;
            job.status = 'pending review';

            const jobInfo = { job: { ...job }};

            await TaskerApi.updateSingleJob(jobInfo);

            setShowCompletionForm(true);
            setJobStarted(false);

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    /** Calculate the time spent working on the job in hours
     * 
     * Returns hours worked
     */
    const calculateHoursWorked = (job) => {
        const startDate = new Date(job.start_time);
        const endDate = new Date(job.end_time);

        // Calculate the time difference in milliseconds
        const timeDifferenceMs = endDate - startDate;

        // Calculate the time difference in hours
        const hoursWorked = timeDifferenceMs / (1000 * 60 * 60);

        return hoursWorked;
    }

    /** Calculate the payment due for the job
     * 
     * Returns payment due rounded to 4 decimal places
     */

    const calculatePaymentDue = (hours, rate) => {
        // calculate payment due based on hours worked
        const value = hours * rate;

        // value to 4 decimal places
        const paymentDue = value.toFixed(4);

        return paymentDue;
    }

    /** Conditionally renders status of job based on user.isWorker property
     * 
     * Shows 'Applied' if the job is still pending and the user has already applied
     */
    const getJobStatus = (applications, job) => {
        if(user.isWorker){
           return <h2>Status: {applications.has(job.id) && job.status !== 'active' ? 'Applied' : `${job.status}`}</h2>
        } else {
            return <h2>Status: {job.status}</h2>
        }
    }

    const showJobStatus = getJobStatus(applications, job);

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
                <JobDetails 
                    job={job} 
                    applications={applications} 
                    user={user} 
                    withdrawApplication={withdrawApplication}
                    startWork={startWork} 
                    onEndWork={() => setShowCompletionForm(true)}
                    applyToJob={applyToJob}
                    toggleDetails={toggleDetails}
                    jobStarted={jobStarted}
                    triggerEffect={triggerEffect}
                    setIsAssigned={() => {setIsAssigned(true)}}
                    isAssigned={isAssigned}
                />
            )}

            {/* Job completion form */}
            {showCompletionForm && (
                <div data-testid="jobCompletion-form-container">
                    <JobCompletionForm job={job} onUpload={() => endWork(job)}/>
                </div>
            )}
        </div>
    )
}

export default JobCard;