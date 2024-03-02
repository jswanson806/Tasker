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
    Modal,
    List,
    Badge,
    Button
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
        // when job has been assigned to a user, status is no longer pending
        if(job.status !== 'pending' ){
            // calls api and updates assignedUser state 
            fetchAndSetAssignedUserInfo(job.assigned_to)
        };

        // isAssigned state triggers this useEffect
    }, [isAssigned])

    useEffect(() => {
        // calls function to retrieve job before image from AWS S3 storage
        getJobBeforeImage(job);
        // if there is an after image attached to the job, calls function to retrieve it from AWS S3 storage
        if(job.after_image_url !== '' && job.after_image_url !== null){
            getJobAfterImage(job);
        }
        // only runs on initial render
    }, []);

    useEffect(() => {
        // is preSignedBeforeUrl is populated and items has not yet been populated        
        if(preSignedBeforeUrl && items.length === 0) {
            // create an image object for the Carousel and push it to the items array
            items.push(
                {
                    id: 1,
                    src: preSignedBeforeUrl,
                    altText: 'Before Image',
                    caption: 'Before'
                },
            )
        }
        // if preSignedAfterUrl is populated
        if(preSignedAfterUrl !== '') {
            // create an image object for the Carousel and push it to the items array
            items.push(
                {
                    id: 2,
                    src: preSignedAfterUrl,
                    altText: 'After Image',
                    caption: 'After'
                },
            )
        }
        // call function to create carousel image slides
        createSlides(items);
        // this is triggered by changes to preSignedBeforeUrl and preSignedAfterUrl
    }, [preSignedBeforeUrl, preSignedAfterUrl])
    

    /** Conditionally returns button elements depending on isWorker property of user object 
     * 
     * Buttons change based on user's relationship with the job
     * 
     * @example applied and job is pending -> Withdraw and Close buttons are rendered
     * 
    */
    const renderDetails = (applications) => {
        // render for worker
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

                    {/* if job has been applied to, withdraw button renders*/}
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
                            {/* job has not been started but is assigned to a user */}
                            {!job.start_time && job.status === 'active' && (
                                <Button 
                                    className="button" 
                                    color="success" 
                                    data-testid="jobDetails-start-button" 
                                    onClick={() => startWork(job)}
                                >
                                    Start Work
                                </Button>
                            )}
                            {/* job has been started */}
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
                            {/* always display message button to assigned worker */}
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
                    {/* always display close button to worker */}
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
        // render for user
        } else {
            return (
                <div className="jobDetails-card" data-testid="jobDetails-card">
                    {/* job is assigned to a worker */}
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
                    {/* job has been completed by the worker */}
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
                    {/* always display close button to user */}
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

    /** Calls api to retrieve all users who have applied to the input job
     * 
     * Maps user info to <li> and saves resulting array in applicantList state
     * 
     * Sets showApplicantList to true
     */
    const getApplicantList = async (job) => {
        try {
            // only display for non-worker users and when job has applicants
            if(!user.isWorker && job.applicants[0]) {
                // hold result of map function in promises variable
                const promises = job.applicants.map(async (id) => {
                    // call api for each id in job.applicants
                    const res = await TaskerApi.getSingleUser(id);
                    const { user } = res;
                    // use user id and name to form list elements
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
                // wait for the promises to resolve from the api calls
                const resultArray = await Promise.all(promises);
                // update applicantList state with the array of <li> elements made
                setApplicantList(resultArray);
                // show the applicant list
                setShowApplicantList(true);
            }
        } catch(err) {
            console.error(err);
            return [];
        }
    }
    
    /** function handles the click event on the applicant <li> 
     * 
     * Sets state of targetUser to the userId
     * 
     * Sets confirmAssigment to true, revealing the Modal containing the Confirmation component
    */
    const handleApplicantClick = (e) => {
        // get the user id from the dataset of the <li> that was clicked
        const userId = e.target.dataset.userId;
        // update targetUser state and convert userId to integer type
        setTargetUser(+userId);
        // update confirmAssignment state
        setConfirmAssignment(true);
    }

    /** Creates a job update object and calls api to updated the job 
     * 
     * Updates the 'assigned_to' and 'status' properties of the job
     * 
     * Updates state of 'isAssigned' to true and 'showApplicantList' to false
     * Resets applicantList state to default
     * 
     * Calls fetchAndSetAssignedUserInfo to get the assigned user from the db
     * Calls sendAutomatedMessage to make inital outreach to the assigned user
     * Calls triggerEffect to trigger useEffect in Jobs component to refresh the jobCards
    */
    const assignToJob = async (job_id, user_id) => {
        try{
            // data object constructed to partially update job in db
            const data = { job: {
                id: job_id,
                assigned_to: user_id,
                status: 'active'
            }}
            // call api to partially update job with data object
            await TaskerApi.updateSingleJob(data);

            // update state of isAssigned
            setIsAssigned(true);
            // hides the applicant list
            setShowApplicantList(false);
            // resets applicantList state to default
            setApplicantList(APPLICANTS_INITIAL_STATE);
            // get the assigned user from the db
            fetchAndSetAssignedUserInfo(user_id);
            // make inital outreach to the assigned user via message
            sendAutomatedMessage(user_id);
            // trigger useEffect in Jobs component to refresh the jobCards
            triggerEffect();
        } catch(err) {
            console.error(err);
        }
        
    }

    /** Constructs message to send when user has been assigned to a job, providing them with the job address
     * 
     * Calls api to create new message
     */
    const sendAutomatedMessage = async (user_id) => {
        // construct initial outreach message
        const msgBody = `Hi! I just hired you to work on my job, ${job.title}! The address is ${job.address}. How soon can you start?`;
        // create message update object
        const message = {message: {
            body: msgBody,
            sent_by: user.id, 
            sent_to: user_id, 
            job_id: job.id
        }};

        try {
            // call api to create new message
            await TaskerApi.createMessage(message);
        } catch (err){
            console.error(err);
        }

    }
    /** Calls api to get a single user from the db
     * 
     * Sets state of assignedUser to the returned user from the api call
     */
    const fetchAndSetAssignedUserInfo = async (user_id) => {
        try {
            // call api to get user by id
            const userRes = await TaskerApi.getSingleUser(user_id);
            // destructure user object from response
            const { user } = userRes;
            // if user is returned, updated assignedUser state with returned user
            if(user) {
                setAssignedUser(user);
            }
        } catch(err) {
            console.error(err);
        }
        
    }
    /** Calls api to retrive before image from AWS S3 storage */
    const getJobBeforeImage = async (job) => {
        // constructs the expected parameters for the api call
        const params = {data: 
            {
                key: job.before_image_url,
                userId: job.posted_by,
            } 
        };
        try{
            // call api to get the before image
            const imageUrl = await TaskerApi.getBeforeImage(params);
            // set the preSignedBeforeUrl state with the preSignedUrl from AWS S3 for before image
            setPresignedBeforeUrl(imageUrl.preSignedUrl);
        }catch(err){
            console.error(err);
        }
    }
    /** Calls api to retrive after image from AWS S3 storage */
    const getJobAfterImage = async (job) => {
        // constructs the expected parameters for the api call
        const params = {data: 
            {
                key: job.after_image_url,
                userId: job.assigned_to,
            } 
        };
        try{
            // call api to get the after image
            const imageUrl = await TaskerApi.getAfterImage(params);
            // set the preSignedAfterUrl state with the preSignedUrl from AWS S3 for after image
            setPresignedAfterUrl(imageUrl.preSignedUrl);
        }catch(err){
            console.error(err);
        }
    }

    /** Called by the Carousel to go to the next image index in the items array
     * 
     * Updates activeIndex state
     */
    const next = () => {
        const nextIndex = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };
    /** Called by the Carousel to go to the previous image index in the items array
     * 
     * Updates activeIndex state
     */
    const previous = () => {
        const nextIndex = activeIndex === 0 ? slides.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };
    /** Called by the Carousel indicator to jump to specifc index 
     * 
     * Updates activeIndex state
    */
    const goToIndex = (newIndex) => {
        setActiveIndex(newIndex);
    };

    /** Maps images in the items array to <img> elements as children of CarouselItem elements*/
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
    
    // variable holds result of renderDetails function for use in JSX
    const showRenderDetails = renderDetails(applications);

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
                                {/* conditionally render controls when more than 1 image available */}
                                {slides.length > 1 && (
                                    <>
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
                                    </>
                                )}
                            </Carousel>
                        
                        <div className="jobDetails-text" data-testid="jobDetails-text">
                            <p>{job.body}</p>
                        </div>
                    {/* Determines when to show the applicants button */}
                    {job.status !== 'active' && 
                    !user.isWorker && 
                    job.applicants[0] && job.status !== ('pending review' || 'active') && (
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

                        {/* confirmation modal for assigning applicant to job */}
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
                        {/* messaging modal for message user or worker */}
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
                    {/* displays the name of the assigned user */}
                    {assignedUser && (
                        <Badge pill color="warning">Assigned to: {assignedUser.firstName} {assignedUser.lastName.slice(0, 1) + "."}</Badge>
                    )}
                </ModalFooter>
            </div>
        </div>
    )
}

export default JobDetails;