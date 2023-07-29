import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api';
import JobCard from './JobCard.js';
import { UserContext } from '../helpers/UserContext';

const Jobs = () => {

    const [jobs, setJobs] = useState([]);
    const [jobCards, setJobCards] = useState([]);
    const {user} = useContext(UserContext)

    useEffect(() => {
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

        fetchAndSetJobs();  
    },[]);

    useEffect(() => {
        setJobCards(jobs.map((job) => {
            return <JobCard user={JSON.parse(user)} job={job} key={job.id}/>
        }));
    }, [jobs])


    return (
        <div>
            <h1>Jobs</h1>
            <div>
                {jobCards}
            </div>
        </div>
    )
}

export default Jobs;