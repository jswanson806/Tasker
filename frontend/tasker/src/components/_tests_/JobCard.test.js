import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import JobCard from '../JobCard.js';
import "../JobDetails.js";
import TaskerApi from '../../api.js';



const userValue = { user: {id: 1, email: "test@email.com", isWorker: true, applications: [1]} };
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

const applications = new Set([job.id]);

const getCurrUser = jest.fn();
const triggerEffect = jest.fn();
const getBeforeImage = jest.spyOn(TaskerApi, 'getBeforeImage');
const getAfterImage = jest.spyOn(TaskerApi, 'getAfterImage');


describe('smoke and snapshot tests', () => {


    test('JobCard component renders correctly', async () => {
        render(
            <JobCard user={userValue.user} applications={applications} job={job} getCurrUser={getCurrUser}/>
        );
    });

    test('JobCard component matches snapshot', async () => {

        render(
            <JobCard user={userValue.user} applications={applications} job={job3} getCurrUser={getCurrUser}/>
        );
    });

})

describe('renders correct information', () => {


    test('shows correct information', async () => {

        expect.assertions(3);

        const {container} = render(
            <JobCard user={userValue3.user} applications={applications} job={job3} getCurrUser={getCurrUser}/>
        );

        expect(container).toHaveTextContent("test job 3");
        expect(container).toHaveTextContent("pending");
        expect(container).not.toHaveTextContent("Applicants:");
    });

    test('should show sliced job body to 30 characters', async () => {
        expect.assertions(2);

        const {container} = render(
            <JobCard user={userValue.user} applications={applications} job={job} getCurrUser={getCurrUser}/>
        );

        expect(container).toHaveTextContent('job 1 body for testing the job...');
        expect(container).not.toHaveTextContent('job 1 body for testing the job card');

    });

})

describe('renders child', () => {

    test('should render JobDetails', async () => {

        expect.assertions(4);

        getBeforeImage.mockResolvedValueOnce({preSignedUrl: ''})
        getAfterImage.mockResolvedValueOnce({preSignedUrl: ''})

        const {container, getByTestId} = render(
            <JobCard triggerEffect={triggerEffect} user={userValue.user} applications={applications} job={job} getCurrUser={getCurrUser}/>
        );

        const jobCard = document.querySelector('.jobCard-card');

        expect(container).not.toHaveTextContent('job 1 body for testing the job card');

        // click the jobCard
        await act(async () => {
            fireEvent.click(jobCard);
        })
        
        // should show job details card
        const jobDetails = getByTestId('jobDetails-card');
        expect(jobDetails).toBeInTheDocument();

        const jobDetailsBody = getByTestId('jobDetails-text');
        expect(jobDetailsBody).toBeInTheDocument();
        expect(jobDetailsBody).toHaveTextContent('job 1 body for testing the job card');


    });
})