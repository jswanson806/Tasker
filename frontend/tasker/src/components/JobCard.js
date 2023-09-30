import React, { useEffect, useState } from 'react';
import JobDetails from './JobDetails.js';
import JobCompletionForm from './JobCompletionForm.js';
import TaskerApi from '../api.js';
import { Modal, Card, CardTitle, Badge, CardText, Form, Col } from 'reactstrap';

const JobCard = ({user, applications, job, fetchCurrUser, triggerEffect}) => {

    const [showCompletionForm, setShowCompletionForm] = useState(false);
    const [currJob, setCurrJob] = useState('');
    const [modal, setModal] = useState(false);

    useEffect(() => {
        setCurrJob(job);
    }, [])

    const toggleDetails = () => {
        setModal(!modal);
    };

    const applyToJob = async (user_id, job_id) => {
        try {
            await TaskerApi.applyToJob(user_id, job_id);
            toggleDetails();
            // refresh user info to get latest applications list
            await fetchCurrUser(user_id);
            
        } catch(err) {
            console.error('Error: ', err)
        }
    }


    const withdrawApplication = async (user_id, job_id) => {
        try {
            toggleDetails();

            await TaskerApi.withdrawApplication(user_id, job_id);
            // refresh user info to get latest applications list
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

            const updatedJob = await TaskerApi.updateSingleJob(jobInfo);

            setCurrJob(updatedJob);

            triggerEffect();

        } catch(err) {
            console.error('Error: ', err)
        }
    }

    const endWork = () => {
        // hide the completion form
        setShowCompletionForm(false);
        // hide the details component
        toggleDetails();
        // refresh the jobs list by triggering useEffect in parent component 'Jobs'
        triggerEffect();
    }
    

    const completeAndPay = async (job) => {
        job.status = 'complete';

        const jobInfo = { job: { ...job }};

        const jobUpdateRes = await TaskerApi.updateSingleJob(jobInfo);
        setCurrJob({job: {...jobUpdateRes}})
        
        // start the stripe payment process here
        const res = await TaskerApi.createCheckoutSession({job: {...currJob}});
        window.location.href = res.url;

    }

    const renderApplicantBadge = (job, user) => {
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

    const renderAppliedBadge = (job, applications) => {
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

    const renderJobStatusBadge = (job) => {
        if(!applications.has(job.id) && job.status === 'pending') {
            return (
                <Badge 
                    color="info" 
                    style={{padding: '5px'}}
                >
                    {job.status}
                </Badge>
            )
        } else if (!applications.has(job.id) && job.status === 'active') {
            return (
                <Badge 
                    color="success" 
                    style={{padding: '5px'}}
                >
                    {job.status}
                </Badge>                
            )
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

    const applicantBadge = renderApplicantBadge(job, user);
    const appliedBadge = renderAppliedBadge(job, applications);
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