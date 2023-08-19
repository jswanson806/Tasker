import React from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import JobCard from '../JobCard.js';
import TaskerApi from '../../api.js';


const userValue = { user: {id: 1, email: "test@email.com", isWorker: true, applications: [1]} };
const userValue2 = { user: {id: 2, email: "test@email.com", isWorker: false} };
const userValue3 = { user: {id: 3, email: "test@email.com", isWorker: true, applications: []} };

const job = {
    id: 1,
    title: "test job 1",
    body: "job 1 body for testing the job card",
    postedBy: 2,
    status: 'pending',
    assignedTo: null,
    paymentDue: null,
    address: '123 Test Street',
    beforeImgUrl: 'http://beforeImgUrl1.com',
    afterImgUrl: null,
    applicants: [1]
};
const job3 = {
    id: 3,
    title: "test job 3",
    body: "job 3 body for testing the job card",
    postedBy: 2,
    status: 'pending',
    assignedTo: null,
    paymentDue: null,
    address: '123 Test Street',
    beforeImgUrl: 'http://beforeImgUrl3.com',
    afterImgUrl: null,
    applicants: []
};

const job2 = {
    id: 2,
    title: "test job 2",
    body: "job 2 body for testing the job card",
    postedBy: 2,
    status: 'active',
    assignedTo: 2,
    paymentDue: null,
    address: '123 Test Street',
    beforeImgUrl: 'http://beforeImgUrl2.com',
    afterImgUrl: null,
    applicants: [2]
};

const applications = new Set([job.id]);

const getSingleUser = jest.spyOn(TaskerApi, 'getSingleUser');
const applyToJob = jest.spyOn(TaskerApi, 'applyToJob');
const withdrawApplication = jest.spyOn(TaskerApi, 'withdrawApplication');
const fetchCurrUser = jest.fn();

describe('smoke and snapshot tests', () => {


    test('JobCard component renders correctly', async () => {
        render(
            <JobCard user={userValue.user} applications={applications} job={job} fetchCurrUser={fetchCurrUser}/>
        );
    });

    test('JobCard component matches snapshot', async () => {

        render(
            <JobCard user={userValue.user} applications={applications} job={job3} fetchCurrUser={fetchCurrUser}/>
        );
    });

})

describe('renders correct information', () => {


    test('shows correct information', async () => {

        expect.assertions(3);

        const {container} = render(
            <JobCard user={userValue3.user} applications={applications} job={job3} fetchCurrUser={fetchCurrUser}/>
        );

        expect(container).toHaveTextContent("test job 3");
        expect(container).toHaveTextContent("pending");
        expect(container).not.toHaveTextContent("Applicants:");
    });

    test('should show sliced job body to 30 characters', async () => {
        expect.assertions(2);

        const {container} = render(
            <JobCard user={userValue.user} applications={applications} job={job} fetchCurrUser={fetchCurrUser}/>
        );

        expect(container).toHaveTextContent('job 1 body for testing the job...');
        expect(container).not.toHaveTextContent('job 1 body for testing the job card');

    });

})

describe('jobCard buttons', () => {

    test('should show/hide job details', async () => {

        expect.assertions(4);

        const {container} = render(
            <JobCard user={userValue.user} applications={applications} job={job} fetchCurrUser={fetchCurrUser}/>
        );

        const jobCard = document.querySelector('.jobCard-card');

        expect(container).not.toHaveTextContent('job 1 body for testing the job card');

        // click the jobCard
        fireEvent.click(jobCard);

        // should show job details card
        const jobDetails = screen.getByTestId('jobDetails-card');
        expect(jobDetails).toBeInTheDocument();
        expect(container).toHaveTextContent('job 1 body for testing the job card');

        // click the jobCard
        fireEvent.click(jobCard);

        expect(container).not.toHaveTextContent('job 1 body for testing the job card');

    });

    test('close button hides details', async () => {

        expect.assertions(2);

        const {container} = render(
            <JobCard user={userValue.user} applications={applications} job={job} fetchCurrUser={fetchCurrUser}/>
        );

        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        // should show job details card
        expect(container).toHaveTextContent('job 1 body for testing the job card');

        const closeButton = screen.getByTestId('jobDetails-close-button')

        // click 'close'
        fireEvent.click(closeButton);
        
        // should have hidden the job details after applying
        expect(container).not.toHaveTextContent('job 1 body for testing the job card')
    });

    test('apply button calls applyToJob and hides details', async () => {

        expect.assertions(4);

        const {container} = render(
            <JobCard user={userValue.user} applications={applications} job={job2} fetchCurrUser={fetchCurrUser}/>
        );

        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        const applyButton = screen.getByTestId('jobDetails-apply-button')
        expect(applyButton).toBeInTheDocument();
        
        // click 'apply' and wait for state update
        await act(async () => {
            fireEvent.click(applyButton);
            getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2, 1]}})
        })

        // should make API call with correct data
        expect(applyToJob).toHaveBeenCalledTimes(1);
        expect(applyToJob).toHaveBeenCalledWith(1, 2);
        
        // should have hidden the job details after applying
        expect(container).not.toHaveTextContent('job 2 body for testing the job card')
    });

    test('withdraw button calls withdrawApplication and hides details', async () => {

        expect.assertions(4);

        const {container} = render(
            <JobCard user={userValue.user} applications={applications} job={job} fetchCurrUser={fetchCurrUser}/>
        );

        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        const withdrawButton = screen.getByTestId('jobDetails-withdraw-button')
        expect(withdrawButton).toBeInTheDocument();
        
        // click 'withdraw' and wait for state update
        await act(async () => {
            fireEvent.click(withdrawButton);
            withdrawApplication.mockResolvedValueOnce({})
        })

        // should make API call with correct data
        expect(withdrawApplication).toHaveBeenCalledTimes(1);
        expect(withdrawApplication).toHaveBeenCalledWith(1, 1);
        
        // should have hidden the job details after withdrawing
        expect(container).not.toHaveTextContent('job 1 body for testing the job card')
    });

})