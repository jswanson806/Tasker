import React, { useState } from 'react';
import JobDetails from './JobDetails.js';
import TaskerApi from '../api.js';

const JobCard = ({user, job, fetchCurrUser}) => {

    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const applyToJob = async (user_id, job_id) => {
        try {
        await TaskerApi.applyToJob(user_id, job_id);
        toggleDetails();
        await fetchCurrUser(user.id);
        } catch(err) {
            throw err;
        }
    }

    return (
        
        <div className="jobCard-container">
            <button onClick={toggleDetails}>
                <div className="jobCard-card">
                    <h3>{job.title}</h3>
                    <p>{job.body.slice(0,30) + "..."}</p>
                </div>
            </button>

            {/* Render the JobDetails component as a pop-up based on showDetails status */}
            {showDetails && (
            <div className="jobDetails-container">
                <div className="jobDetails-card" data-testid="jobDetails-card">
                    <JobDetails job={job} key={job.id}/>
                    <button data-testid="jobDetails-apply-button" onClick={() => applyToJob(user.id, job.id)}>Apply</button>
                    <button data-testid="jobDetails-close-button" onClick={toggleDetails}>Close</button>
                </div>
            </div>
            )}
        </div>
    )
}

export default JobCard;