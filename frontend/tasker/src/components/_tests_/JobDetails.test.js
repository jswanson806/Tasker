import React from "react";
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import JobDetails from "../JobDetails.js";
import TaskerApi from "../../api.js";
import "reactstrap";

const userValue = { user: {id: 1, first_name: "Joe", last_name: "Doe", email: "test@email.com", isWorker: true, applications: [1]} };
const userValue2 = { user: {id: 2, email: "test@email.com", isWorker: false} };
const userValue3 = { user: {id: 3, email: "test@email.com", isWorker: true, applications: []} };

const job = {
    id: 1,
    title: "test job 1",
    body: "job 1 body for testing the job card",
    posted_by: 2,
    status: 'pending',
    assigned_to: null,
    payment_due: null,
    address: '123 Test Street',
    before_image_url: 'http://beforeImgUrl1.com',
    after_image_url: null,
    applicants: [1]
};
const job3 = {
    id: 3,
    title: "test job 3",
    body: "job 3 body for testing the job card",
    posted_by: 2,
    status: 'pending',
    assigned_to: null,
    payment_due: null,
    address: '123 Test Street',
    before_image_url: 'http://beforeImgUrl3.com',
    after_image_url: null,
    applicants: []
};

const job2 = {
    id: 2,
    title: "test job 2",
    body: "job 2 body for testing the job card",
    postedBy: 1,
    status: 'active',
    assigned_to: 3,
    payment_due: null,
    address: '123 Test Street',
    before_image_url: 'http://beforeImgUrl2.com',
    after_image_url: null,
    applicants: [1, 3]
};

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
    after_image_url: 'http://afterImgUrl2.com',
    applicants: [1, 2]
};

const job5 = {
    id: 4,
    title: "test job 4",
    body: "job 4 body for testing the job card",
    posted_by: 2,
    status: 'pending review',
    assigned_to: 3,
    start_time: 'test start time',
    end_time: 'test end time',
    payment_due: null,
    address: '123 Test Street',
    before_image_url: 'http://beforeImgUrl2.com',
    after_image_url: 'http://afterImgUrl2.com',
    applicants: []
};

const applications = new Set([job.id, job4.id]);

const triggerEffect = jest.fn();
const fetchCurrUser = jest.fn();
const getSingleUser = jest.spyOn(TaskerApi, 'getSingleUser');
const applyToJob = jest.spyOn(TaskerApi, 'applyToJob');
const getBeforeImage = jest.spyOn(TaskerApi, 'getBeforeImage');
const getAfterImage = jest.spyOn(TaskerApi, 'getAfterImage');
const updateSingleJob = jest.spyOn(TaskerApi, 'updateSingleJob');
const onEndWork = jest.fn();
const startWork = jest.fn();
const withdrawApplication = jest.fn();
const onJobComplete = jest.fn();
const toggleDetails = jest.fn();


beforeEach(() => {
    getBeforeImage.mockResolvedValueOnce({preSignedUrl: 'presigned_before'});
    getAfterImage.mockResolvedValueOnce({preSignedUrl: 'presigned_after'});
})

afterEach(() => {
    jest.clearAllMocks();
})

describe('smoke and snapshot tests', () => {


    test('JobDetails component renders correctly', async () => {
        await act(() => render(
            <JobDetails 
                user={userValue.user} 
                applications={applications} 
                job={job} 
                fetchCurrUser={fetchCurrUser} 
                onEndWork={onEndWork} 
                startWork={startWork} 
                withdrawApplication={withdrawApplication} 
                onJobComplete={onJobComplete} 
                toggleDetails={toggleDetails}
                triggerEffect={triggerEffect}
            />
        ));
    });

    test('JobDetails component matches snapshot', async () => {

        await act(() => render(
            <JobDetails
                user={userValue.user} 
                applications={applications} 
                job={job} 
                fetchCurrUser={fetchCurrUser} 
                onEndWork={onEndWork} 
                startWork={startWork} 
                withdrawApplication={withdrawApplication} 
                onJobComplete={onJobComplete} 
                toggleDetails={toggleDetails}
                triggerEffect={triggerEffect}
            />
        ));
    });

})

describe('jobDetails useEffect hook', () => {

    test('calls getSingleUser with job.assigned_to value upon render when job status !== pending', async () => {
        expect.assertions(2);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 1, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job2} 
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

        expect(getSingleUser).toHaveBeenCalledTimes(1);
        expect(getSingleUser).toHaveBeenCalledWith(3);
    })

})


describe('jobDetails buttons', () => {

    test('close button hides details', async () => {

        expect.assertions(2);

        await act (async () => {
            render(
                <JobDetails
                    user={userValue.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job} 
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



        const jobDetails = screen.getByTestId('jobDetails-text')
        // should show job details card
        expect(jobDetails).toBeInTheDocument();

        const closeButton = screen.getByTestId('jobDetails-close-button')

        await act(async () => {
            // click 'close'
            fireEvent.click(closeButton);
        })
            
        
        // should have called toggleDetails, which hides the details
        expect(toggleDetails).toHaveBeenCalled();

    });

    test('apply button calls applyToJob and hides details', async () => {

        expect.assertions(4);

        await act (async () => {
            render(
                <JobDetails
                    user={userValue3.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job3} 
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

        const applyButton = screen.queryByTestId('jobDetails-apply-button')
        const withdrawButton = screen.queryByTestId('jobDetails-withdraw-button')
        expect(withdrawButton).not.toBeInTheDocument();
        expect(applyButton).toBeInTheDocument();
        
        // click 'apply' and wait for state update
        await act(async () => {
            fireEvent.click(applyButton);
            getSingleUser.mockResolvedValueOnce({user: {id: 3, applications: [2, 1]}});
        })

        // should make API call with correct data
        expect(applyToJob).toHaveBeenCalledTimes(1);
        expect(applyToJob).toHaveBeenCalledWith(3, 3);

    });

    test('applied jobs hide apply button and show withdraw button', async () => {

        expect.assertions(2);

        await act (async () => {
            render(
                <JobDetails
                    user={userValue.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job} 
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
    
        const applyButton = screen.queryByTestId('jobDetails-apply-button')
        const withdrawButton = screen.queryByTestId('jobDetails-withdraw-button')
        expect(withdrawButton).toBeInTheDocument();
        expect(applyButton).not.toBeInTheDocument();

    });

    test('withdraw button calls withdrawApplications', async () => {

        expect.assertions(2);

        await act (async () => {
            render(
                <JobDetails
                    user={userValue.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job} 
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

        const withdrawButton = screen.queryByTestId('jobDetails-withdraw-button')
        
        // click 'apply' and wait for state update
        await act(async () => {
            fireEvent.click(withdrawButton);
        
        })

        // should make API call with correct data
        expect(withdrawApplication).toHaveBeenCalledTimes(1);
        expect(withdrawApplication).toHaveBeenCalledWith(1, 1);

    });

    test('api is called when applicants button is clicked', async () => {

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 1, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.com", 
                isWorker: true, 
                applications: [1]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue2.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job} 
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

        const button = screen.getByTestId('jobCard-applicants-button');
        expect(button).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(button);
        })

        // should make API call with correct data within getApplicantList function
        expect(getSingleUser).toHaveBeenCalledTimes(1);
        expect(getSingleUser).toHaveBeenCalledWith(1);

    });

    test('renders list of applicants when applicants button is clicked', async () => {

        expect.assertions(4)

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 1, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue2.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job} 
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

        const button = screen.getByTestId('jobCard-applicants-button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        // should make API call with correct data within getApplicantList function
        expect(getSingleUser).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            const applicantLi = screen.queryByTestId('jobDetails-applicant-li');
            expect(applicantLi).toBeInTheDocument();
            const applicantName = screen.queryByText("Joe D.");
            expect(applicantName).toBeInTheDocument();
        })
    })

    test('shows the confirmation modal when applicants button is clicked', async () => {

        expect.assertions(3);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 1, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue2.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job} 
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

        const button = screen.getByTestId('jobCard-applicants-button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        let applicantLi;

        await waitFor(async () => {
            applicantLi = screen.queryByTestId('jobDetails-applicant-li');
            expect(applicantLi).toBeInTheDocument();
        })

        await act(async () => {
            fireEvent.click(applicantLi);
        })

         await waitFor(async () => {
            expect(screen.queryByTestId("confirmation-confirm-button")).toBeInTheDocument();
        })
        
        
    })

    test('shows the start job button when worker is assigned to a job', async () => {

        expect.assertions(3);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue3.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job2} 
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

        const button = screen.getByTestId('jobDetails-start-button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(startWork).toHaveBeenCalledTimes(1);
        expect(startWork).toHaveBeenCalledWith(job2);


        
    })

    test('start button calls startWork with correct data', async () => {

        expect.assertions(2);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue3.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job2} 
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

        const button = screen.getByTestId('jobDetails-start-button');

        fireEvent.click(button);
        expect(startWork).toHaveBeenCalledTimes(1);
        expect(startWork).toHaveBeenCalledWith(job2);

        
    })

    test('job that is started shows endWork button', async () => {

        expect.assertions(2);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

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

        const endBtn = screen.queryByTestId('jobDetails-end-button');
        const startBtn = screen.queryByTestId('jobDetails-start-button');
        expect(startBtn).not.toBeInTheDocument();
        expect(endBtn).toBeInTheDocument();

    })

    test('endWork button calls onEndWork', async () => {

        expect.assertions(3);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

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

        const endBtn = screen.queryByTestId('jobDetails-end-button');
        const startBtn = screen.queryByTestId('jobDetails-start-button');
        expect(startBtn).not.toBeInTheDocument();
        expect(endBtn).toBeInTheDocument();

        fireEvent.click(endBtn);
        expect(onEndWork).toHaveBeenCalledTimes(1);
        
    })

    test('message button is displayed', async () => {

        expect.assertions(1);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

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
        
    })

    test('message button displays newMessageForm modal', async () => {

        expect.assertions(2);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

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
        await waitFor(() => {
            expect(screen.queryByTestId('convo-message-input')).toBeInTheDocument();
        })
        
    })

    test('job that is finished shows review button', async () => {

        expect.assertions(1);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue2.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job5} 
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

        const button = screen.queryByTestId('jobDetails-review-button');
        expect(button).toBeInTheDocument();
        
    })

    test('review button calls onJobComplete', async () => {

        expect.assertions(2);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 3, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.comm", 
                isWorker: true, 
                applications: [1, 2]
            }});

        await act (async () => {
            render(
                <JobDetails
                    user={userValue2.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job5} 
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

        const button = screen.queryByTestId('jobDetails-review-button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(onJobComplete).toHaveBeenCalledTimes(1);
        
    })

});

describe('carousel images', () => {

    test('makes call to api for before image on', async () => {

        expect.assertions(3);
       
        await act (async () => {
            render(
                <JobDetails
                    user={userValue2.user} 
                    applications={applications} 
                    applyToJob={applyToJob}
                    job={job} 
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

        expect(getBeforeImage).toHaveBeenCalledTimes(1);
        expect(getBeforeImage).toHaveBeenCalledWith({"data": {"key": "http://beforeImgUrl1.com", "userId": 2}});

        await waitFor(() => {
            expect(screen.queryByTestId("Before Image")).toBeInTheDocument();
        })
    });

    test('makes call to api for after image on render', async () => {

        expect.assertions(3);

        getSingleUser.mockResolvedValueOnce({user: 
            {
                id: 1, 
                firstName: "Joe", 
                lastName: "Doe", 
                email: "test@email.com", 
                isWorker: true, 
                applications: [1]
            }});
       
            await act (async () => {
                render(
                    <JobDetails
                        user={userValue2.user} 
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

        expect(getAfterImage).toHaveBeenCalledTimes(1);
        expect(getAfterImage).toHaveBeenCalledWith({"data": {"key": "http://afterImgUrl2.com", "userId": 3}});

        await waitFor(() => {
            expect(screen.queryByTestId("After Image")).toBeInTheDocument();
        })
    });

});

// describe('renders confirmation modal', () => {
//     test('works', async () => {

//         await act (async () => {
//             render(
//                 <JobDetails
//                     user={userValue2.user} 
//                     applications={applications} 
//                     applyToJob={applyToJob}
//                     job={job4} 
//                     fetchCurrUser={fetchCurrUser} 
//                     onEndWork={onEndWork} 
//                     startWork={startWork} 
//                     withdrawApplication={withdrawApplication} 
//                     onJobComplete={onJobComplete} 
//                     toggleDetails={toggleDetails}
//                     triggerEffect={triggerEffect}
//                 />
//             );
//         });

//         const confirmation = screen.getByTestId()

//     })
// })

