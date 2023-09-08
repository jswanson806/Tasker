import React, {useEffect, useState} from 'react';
import TaskerApi from '../api.js'
import Confirmation from './Confirmation.js';
import NewMessageForm from './NewMessageForm.js';

const JobDetails = (
    {
        job, 
        applications, 
        user,
        onEndWork,
        startWork,
        withdrawApplication,
        applyToJob,
        toggleDetails,
        triggerEffect
    }) => {

    const APPLICANTS_INITIAL_STATE = '';
    const ASSIGNED_USER_INITIAL_STATE = '';
    const TARGET_USER_INITIAL_STATE = '';

    const [applicantList, setApplicantList] = useState(APPLICANTS_INITIAL_STATE)
    const [showApplicantList, setShowApplicantList] = useState(false);
    const [confirmAssignment, setConfirmAssignment] = useState(false);
    const [isAssigned, setIsAssigned] = useState(false);
    const [assignedUser, setAssignedUser] = useState(ASSIGNED_USER_INITIAL_STATE);
    const [targetUser, setTargetUser] = useState(TARGET_USER_INITIAL_STATE);
    const [showMessageInput, setShowMessageInput] = useState(false);


    useEffect(() => {
        if(job.status === 'active' ){
            fetchAndSetAssignedUserInfo(job.assigned_to)
        };

        triggerEffect();
    }, [isAssigned])
    

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

                    {/* apply button shows on jobs that have not yet been applied to */}
                    {!applications.has(job.id) && (
                        <button data-testid="jobDetails-apply-button" onClick={() => applyToJob(user.id, job.id)}>Apply</button>
                    )}

                    {/* if job has been applied to, apply button is unapply */}
                    {applications.has(job.id) && job.status === 'pending' && (
                        <button data-testid="jobDetails-withdraw-button" onClick={() => withdrawApplication(user.id, job.id)}>Withdraw</button>
                    )}

                    {/* show start and end work button on jobs that are assigned to user */}
                    {job.assigned_to === user.id && (
                        <div className="jobDetails-card-button-container">
                            {!job.start_time && job.status === 'active' && (
                                <button data-testid="jobDetails-start-button" onClick={() => startWork(job)}>Start Work</button>
                            )}
                            {job.start_time && job.status === 'in progress' && (
                                <button data-testid="jobDetails-end-button" onClick={onEndWork}>End Work</button>
                            )}
                            
                            <button data-testid="jobDetails-message-button" onClick={() => setShowMessageInput(true)}>Message</button>
                            
                        </div>
                    )}
                    
                    <button data-testid="jobDetails-close-button" onClick={toggleDetails}>Close</button>
                </div>
            )
        } else {
            return (
                <div className="jobDetails-card" data-testid="jobDetails-card">
                    {job.assigned_to && (
                        <button data-testid="jobDetails-message-button" onClick={() => setShowMessageInput(true)}>Message Worker</button>
                    )}
                        <button data-testid="jobDetails-close-button" onClick={toggleDetails}>Close</button>
                </div>
            )
        }
    }

    const getApplicantCount = (job) => {

        if(job.applicants){
        
            return <button 
                        className="jobCard-applicants-button" 
                        onClick={() => getApplicantList(job)}
                        >
                            {job.applicants[0] ? job.applicants.length : '0'}
                    </button>
        }
       
    }

    const getApplicantList = async (job) => {
        try {

            if(!user.isWorker && job.applicants[0]) {

                const promises = job.applicants.map(async (id) => {
                    const res = await TaskerApi.getSingleUser(id);
                    const { user } = res;
                    return (
                        <div key={user.id}>
                            <button data-user-id={user.id} 
                                    onClick={handleApplicantClick}
                            >
                                {user.firstName} {user.lastName.slice(0, 1) + "."}
                            </button>
                        </div>
                    );
                })


                const resultArray = await Promise.all(promises);

                setApplicantList(resultArray);
                setShowApplicantList(true);
            } 
            
        } catch(err) {
            console.error(err);
            return [];
        }
    }
    

    const handleApplicantClick = (e) => {
        const userId = e.target.dataset.userId;
        setTargetUser(+userId);
        setConfirmAssignment(true);
    }

    const assignToJob = async (job_id, user_id) => {

        try{

            const data = { job: {
                id: job_id,
                assigned_to: user_id,
                status: 'active'
            }}

            await TaskerApi.updateSingleJob(data);

            
            setIsAssigned(true);
            setShowApplicantList(false);
            setApplicantList(APPLICANTS_INITIAL_STATE);

            fetchAndSetAssignedUserInfo(user_id);
            triggerEffect();
        } catch(err) {
            console.error(err);
        }
        
    }

    const fetchAndSetAssignedUserInfo = async (user_id) => {
        try {
            const userRes = await TaskerApi.getSingleUser(user_id);
            const { user } = userRes;
            if(user) {
                setAssignedUser(user);
            }
        } catch(err) {
            console.error(err);
        }
        
    }

    const showApplicantCount = getApplicantCount(job);
    const showRenderDetails = renderDetails(applications);

    return(
        <div className="jobDetails-container">
            <h1>{job.title}</h1>
            {assignedUser && (`Assigned to: ${assignedUser.firstName} ${assignedUser.lastName.slice(0, 1) + "."}`)}
            <p>{job.body}</p>

            <div className="jobDetails-details">
                {showRenderDetails}
                
                {job.status !== 'active' && !user.isWorker && job.assigned_to === null &&(
                    <p>Applications: {showApplicantCount}</p>
                )}
                {/* list of applicants */}
                {showApplicantList && assignedUser === ASSIGNED_USER_INITIAL_STATE && (
                    <ol>
                        {applicantList}
                    </ol>
                )}
                
            </div>
            <div>
                {confirmAssignment && targetUser && (
                    <Confirmation 
                        targetUserId={targetUser}
                        job={job} 
                        onConfirm={assignToJob} 
                        onClose={() => setConfirmAssignment(false)}
                    />
                )}
            </div>
            <div>
                {showMessageInput && (
                    <NewMessageForm 
                        assignedUser={assignedUser} 
                        jobId={job.id} 
                        currUser={user} 
                        onAction={() => setShowMessageInput(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default JobDetails;