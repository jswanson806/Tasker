import React from 'react';
import {act, render, screen, fireEvent, waitFor} from '@testing-library/react';
import TaskerApi from '../../api.js';
import NewMessageForm from '../NewMessageForm.js';
import JobDetails from '../JobDetails.js';

// NewMessage component props
const currUser = {id: 1, email: "test@email.com", isWorker: true};
const convoId = 'u1u2j1';
const onAction = jest.fn();
const onClose = jest.fn();
const onMessageSent = jest.fn();
const assignedUser = {id: 1};
const handleClose = jest.fn();

// JobDetails component props
const job4 = {
    id: 4,
    title: "test job 4",
    body: "job 4 body for testing the job card",
    posted_by: 2,
    status: 'in progress',
    assigned_to: 3,
    start_time: 'test start time',
    payment_due: null,
    address: '123 Test Street',
    before_image_url: 'http://beforeImgUrl2.com',
    after_image_url: null,
    applicants: [1, 2]
};
const userValue3 = { user: {id: 3, email: "test@email.com", isWorker: true, applications: []} };
const onEndWork = jest.fn();
const startWork = jest.fn();
const withdrawApplication = jest.fn();
const onJobComplete = jest.fn();
const toggleDetails = jest.fn();
const triggerEffect = jest.fn();
const fetchCurrUser = jest.fn();

const applications = new Set([job4.id]);

// api mocks
const getBeforeImage = jest.spyOn(TaskerApi, 'getBeforeImage');
const applyToJob = jest.spyOn(TaskerApi, 'applyToJob');
const createMessage = jest.spyOn(TaskerApi, 'createMessage');
const getSingleUser = jest.spyOn(TaskerApi, 'getSingleUser');


describe("login form smoke and snapshot tests", () => {

    it("should render without crashing", async () => {

        render(
            <NewMessageForm
                convoId={convoId}
                currUser={currUser}
                assignedUser={{id: 2}}
                jobId={1}
                onAction={onAction}
                onMessageSent={onMessageSent}
                onClose={onClose}
            />
        );
        
    });

    it("should match snapshot", async() => {

        const {asFragment} = render(
            <NewMessageForm
                convoId={convoId}
                currUser={currUser}
                assignedUser={{id: 2}} 
                jobId={1}
                onAction={onAction}
                onMessageSent={onMessageSent}
                onClose={onClose}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    })
})

describe("Handles form input correctly", () => {

    it('updates form input correctly', async () => {

        render(
            <NewMessageForm
                convoId={convoId}
                currUser={currUser}
                assignedUser={{id: 2}} 
                jobId={1}
                onAction={onAction}
                onMessageSent={onMessageSent}
                onClose={onClose}
            />
        );

        const msgInput = screen.getByTestId("convo-message-input");
        fireEvent.change(msgInput, {target: {value: "test message"}});

        expect(msgInput).toHaveValue("test message");

    })

    it('should handle form submission', async () => {

        render(
            <NewMessageForm
                convoId={convoId}
                currUser={currUser}
                assignedUser={{id: 2}} 
                jobId={1}
                onMessageSent={onMessageSent}
                onClose={onClose}
            />
        );

        const msgInput = screen.getByTestId("convo-message-input");
        fireEvent.change(msgInput, {target: {value: "test message"}});

        const btn = screen.getByTestId("convo-form-button");

        await act(async () => {
            fireEvent.click(btn);
        })

        const message = {message: {
            body: "test message",
            sent_by: currUser.id, 
            sent_to: 2, 
            job_id: 1
        }};
        expect(createMessage).toHaveBeenCalledTimes(1);
        expect(createMessage).toHaveBeenCalledWith(message);

    })

})

describe("Buttons call functions correctly", () => {

    it('sending message calls onMessageSent with correct data', async () => {
        expect.assertions(2)

        render(
            <NewMessageForm
                convoId={convoId}
                currUser={currUser}
                assignedUser={assignedUser}
                onMessageSent={onMessageSent}
                jobId={1}
                onClose={onClose}
            />
        );

        const msgInput = screen.getByTestId("convo-message-input");
        fireEvent.change(msgInput, {target: {value: "test message"}});

        const btn = screen.getByTestId("convo-form-button");

        await act(async () => {
            fireEvent.click(btn);
        })

        expect(onMessageSent).toHaveBeenCalledTimes(1);
        expect(onMessageSent).toHaveBeenCalledWith(assignedUser, currUser.id, convoId);
        
    })

    it('sending message calls onAction when passed from JobDetails component', async () => {
        // expect.assertions(2)
 
        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

        getBeforeImage.mockResolvedValueOnce({preSignedUrl: 'presigned_before'});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue3.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job4} 
                    fetchCurrUser={fetchCurrUser} 
                    onEndWork={onEndWork} 
                    startWork={startWork} 
                    withdrawApplication={withdrawApplication} 
                    onJobComplete={onJobComplete} 
                    toggleDetails={toggleDetails}
                    triggerEffect={triggerEffect}
                />
            );
        }); 

        const button = screen.queryByTestId('jobDetails-message-button');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        
        const msgInput = screen.getByTestId("convo-message-input");
        expect(msgInput).toBeInTheDocument();

        fireEvent.change(msgInput, {target: {value: "test message"}});

        const submitBtn = screen.getByTestId("convo-form-button");
        expect(submitBtn).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(submitBtn);
        })

        expect(createMessage).toHaveBeenCalledTimes(1);
        // onAction should have been called, which will hide the NewMessageForm
        expect(msgInput).not.toBeInTheDocument();
        
    })

    it('close calls onClose', async () => {
        expect.assertions(2)

        render(
            <NewMessageForm
                convoId={convoId}
                currUser={currUser}
                assignedUser={assignedUser}
                onMessageSent={onMessageSent}
                jobId={1}
                onClose={onClose}
            />
        );

        const closeBtn = screen.getByTestId("convo-close-button");
        expect(closeBtn).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(closeBtn);
        })

        expect(onClose).toHaveBeenCalledTimes(1);
        
    })

})