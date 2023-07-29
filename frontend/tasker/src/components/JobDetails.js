import React from 'react';

const JobDetails = ({job}) => {
    return(
        <>
        <h1>{job.title}</h1>
        <p>{job.body}</p>
        </>
    )
}

export default JobDetails;