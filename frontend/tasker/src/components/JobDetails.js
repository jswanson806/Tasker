import React, {useEffect, useState} from 'react';
import TaskerApi from '../api.js'
import Confirmation from './Confirmation.js';
import NewMessageForm from './NewMessageForm.js';
import { 
    ModalBody, 
    ModalFooter, 
    ModalHeader, 
    Carousel, 
    CarouselItem, 
    CarouselControl, 
    CarouselIndicators, 
    CarouselCaption, 
    Modal,
    List,
    Badge,
    Button,
    Card
} from 'reactstrap';

import "./styles/JobDetails.css";

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
        onJobComplete,
        triggerEffect
    }) => {

    const APPLICANTS_INITIAL_STATE = '';
    const ASSIGNED_USER_INITIAL_STATE = '';
    const TARGET_USER_INITIAL_STATE = '';
    const items = [];

    const [applicantList, setApplicantList] = useState(APPLICANTS_INITIAL_STATE)
    const [showApplicantList, setShowApplicantList] = useState(false);
    const [confirmAssignment, setConfirmAssignment] = useState(false);
    const [isAssigned, setIsAssigned] = useState(false);
    const [assignedUser, setAssignedUser] = useState(ASSIGNED_USER_INITIAL_STATE);
    const [targetUser, setTargetUser] = useState(TARGET_USER_INITIAL_STATE);
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [preSignedBeforeUrl, setPresignedBeforeUrl] = useState('');
    const [preSignedAfterUrl, setPresignedAfterUrl] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        if(job.status !== 'pending' ){
            fetchAndSetAssignedUserInfo(job.assigned_to)
        };

        triggerEffect();
    }, [isAssigned])

    useEffect(() => {
        getJobBeforeImage(job);
        
        if(job.after_image_url !== '' && job.after_image_url !== null){
            getJobAfterImage(job);
        }

    }, []);

    useEffect(() => {
        if(preSignedBeforeUrl && items.length === 0) {
            items.push(
                {
                    id: 1,
                    src: preSignedBeforeUrl,
                    altText: 'Before Image',
                    caption: 'Before'
                },
            )
        }

        if(preSignedAfterUrl !== '') {
            items.push(
                {
                    id: 2,
                    src: preSignedAfterUrl,
                    altText: 'After Image',
                    caption: 'After'
                },
            )
        }

        createSlides(items);
    }, [preSignedBeforeUrl, preSignedAfterUrl])
    

    /** Conditionally returns button elements depending on isWorker property of user object 
     * 
     * Buttons change based on context of user's relationship with the job
     * 
     * @example applied and job is pending -> Withdraw and Close buttons present
     * 
    */
    const renderButtons = (applications) => {

        if(user.isWorker) {
            return (
                <div className="jobDetails-card" data-testid="jobDetails-card">

                    {/* apply button shows on jobs that have not yet been applied to */}
                    {!applications.has(job.id) && (
                        <Button 
                            className="button" 
                            color="success" 
                            data-testid="jobDetails-apply-button" 
                            onClick={() => applyToJob(user.id, job.id)}
                        >
                            Apply
                        </Button>
                    )}

                    {/* if job has been applied to, apply button is withdraw button */}
                    {applications.has(job.id) && job.status === 'pending' && (
                        <Button 
                            className="button" 
                            color="warning" 
                            data-testid="jobDetails-withdraw-button" 
                            onClick={() => withdrawApplication(user.id, job.id)}
                        >
                            Withdraw
                        </Button>
                    )}

                    {/* show start and end work button on jobs that are assigned to user */}
                    {job.assigned_to === user.id && (
                        <div className="jobDetails-card-button-container">
                            {!job.start_time && job.status === 'active' && (
                                <Button 
                                    className="button" 
                                    color="Success" 
                                    data-testid="jobDetails-start-button" 
                                    onClick={() => startWork(job)}
                                >
                                    Start Work
                                </Button>
                            )}
                            {job.start_time && job.status === 'in progress' && (
                                <Button 
                                    className="button" 
                                    color="danger" 
                                    data-testid="jobDetails-end-button" 
                                    onClick={onEndWork}
                                >
                                    End Work
                                </Button>
                            )}
                            
                            <Button 
                                className="button" 
                                color="info" 
                                data-testid="jobDetails-message-button" 
                                onClick={() => setShowMessageInput(true)}
                            >
                                Message
                            </Button>
                        </div>
                    )}
                    
                    <Button 
                        className="button" 
                        color="danger" 
                        data-testid="jobDetails-close-button" 
                        onClick={toggleDetails}
                    >
                        Close
                    </Button>
                </div>
            )
        } else {
            return (
                <div className="jobDetails-card" data-testid="jobDetails-card">
                    {job.assigned_to && (
                        <Button 
                            className="button" 
                            color="info" 
                            data-testid="jobDetails-message-button" 
                            onClick={() => setShowMessageInput(true)}
                        >
                            Message Worker
                        </Button>
                    )}
                    {job.status === 'pending review' && (
                        <Button 
                            className="button" 
                            color="info" 
                            data-testid="jobDetails-review-button" 
                            onClick={onJobComplete}
                        >
                            Review
                        </Button>
                    )}
                        <Button 
                            className="button" 
                            color="danger" 
                            data-testid="jobDetails-close-button" 
                            onClick={toggleDetails}
                        >
                            Close
                        </Button>
                </div>
            )}};

    const getApplicantList = async (job) => {
        try {

            if(!user.isWorker && job.applicants[0]) {

                const promises = job.applicants.map(async (id) => {
                    const res = await TaskerApi.getSingleUser(id);
                    const { user } = res;
                    return (

                        <li
                            data-testid="jobDetails-applicant-li"
                            data-user-id={user.id}
                            key={user.id} 
                            onClick={handleApplicantClick}
                        >
                            {user.firstName} {user.lastName.slice(0, 1) + "."}
                        </li>

                    );
                })


                const resultArray = await Promise.all(promises);

                setApplicantList(resultArray);
                setShowApplicantList(true);
            }
            
            return;
            
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

    const getJobBeforeImage = async (job) => {

        const params = {data: 
            {
                key: job.before_image_url,
                userId: job.posted_by,
            } 
        };
        try{
            const imageUrl = await TaskerApi.getBeforeImage(params);
            setPresignedBeforeUrl(imageUrl.preSignedUrl);
        }catch(err){
            console.error(err);
        }
    }

    const getJobAfterImage = async (job) => {

        const params = {data: 
            {
                key: job.after_image_url,
                userId: job.assigned_to,
            } 
        };
        try{
            const imageUrl = await TaskerApi.getAfterImage(params);
            setPresignedAfterUrl(imageUrl.preSignedUrl);
        }catch(err){
            console.error(err);
        }
    }


    const next = () => {
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        setActiveIndex(newIndex);
    };

    
    const createSlides = (items) => {
        setSlides(items.map((item, index) => {
        
            return (
                
                <CarouselItem 
                    tag="div"
                    key={index}
                >
                    <img
                        data-testid={item.altText}
                        src={item.src} 
                        alt={item.altText}
                    />
                </CarouselItem>
            );
        }));
    }
    

    const showRenderDetails = renderButtons(applications);

    return(
        <div className="jobDetails-container">
            <div className="jobDetails-centered-card">
                <ModalHeader>{job.title}</ModalHeader>
                    <ModalBody>
                            <Carousel
                                key={job.title} 
                                activeIndex={activeIndex} 
                                next={next} 
                                previous={previous} 
                                interval={false} 
                                pause={false}
                            >
                                <CarouselIndicators
                                    items={items}
                                    activeIndex={activeIndex}
                                    onClickHandler={goToIndex}
                                />
                                {slides}
                                <CarouselControl
                                    direction="prev"
                                    directionText="Previous"
                                    onClickHandler={previous}
                                />
                                <CarouselControl
                                    direction="next"
                                    directionText="Next"
                                    onClickHandler={next}
                                />
                            </Carousel>
                        
                        <div className="jobDetails-text" data-testid="jobDetails-text">
                            <p>{job.body}</p>
                        </div>
                                
                    {job.status !== 'active' && !user.isWorker && job.assigned_to === null &&(
                            
                            <Button 
                                color="info"
                                className="jobCard-applicants-button"
                                data-testid="jobCard-applicants-button" 
                                onClick={() => getApplicantList(job)}
                            >
                                Applicants
                            </Button>
                    )}
                        {/* list of applicants */}
                        {showApplicantList && assignedUser === ASSIGNED_USER_INITIAL_STATE && (
                            <List type="unstyled">
                                {applicantList}
                            </List>
                        )}

                        {showRenderDetails}

                        
                        {confirmAssignment && targetUser && (
                            <Modal 
                                isOpen={confirmAssignment} 
                                toggle={() => setConfirmAssignment(false)} 
                                style={{position: "relative", marginTop: "20%"}}
                            >
                                <Confirmation 
                                    targetUserId={targetUser}
                                    job={job} 
                                    onConfirm={assignToJob} 
                                    onClose={() => setConfirmAssignment(false)}
                                />
                            </Modal>
                        )}

                        {showMessageInput && (
                            <Modal 
                                isOpen={showMessageInput} 
                                toggle={() => setShowMessageInput(false)} 
                                style={{position: "relative", marginTop: "20%"}}
                            >
                                <NewMessageForm 
                                    assignedUser={assignedUser} 
                                    jobId={job.id} 
                                    currUser={user} 
                                    onAction={() => setShowMessageInput(false)}
                                />
                            </Modal>
                        )}

                    </ModalBody>
                <ModalFooter>
                    {assignedUser && (
                        <Badge pill color="warning">Assigned to: {assignedUser.firstName} {assignedUser.lastName.slice(0, 1) + "."}</Badge>
                    )}
                </ModalFooter>
            </div>
        </div>
    )
}

export default JobDetails;