import React from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import Jobs from '../Jobs.js';
import { UserContext } from '../../helpers/UserContext.js';
import TaskerApi from '../../api.js';
// import JobDetails from '../JobDetails.js';


const userValue = { user: '{"id": 1, "email": "test@email.com", "isWorker": true}' };
const userValue2 = { user: '{"id": 1, "email": "test@email.com", "isWorker": false}' };

const getSingleUser = jest.spyOn(TaskerApi, 'getSingleUser');
const getAllAvailableJobs = jest.spyOn(TaskerApi, 'getAllAvailableJobs');
const getAppliedWorkerJobs = jest.spyOn(TaskerApi, 'getAppliedWorkerJobs');
const getAllAssignedWorkerJobs = jest.spyOn(TaskerApi, 'getAllAssignedWorkerJobs');
const getActiveUserJobs = jest.spyOn(TaskerApi, 'getActiveUserJobs');
const getPendingReviewUserJobs = jest.spyOn(TaskerApi, 'getPendingReviewUserJobs');
const getBeforeImage = jest.spyOn(TaskerApi, 'getBeforeImage');

describe('smoke and snapshot tests', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
        getAllAvailableJobs.mockResolvedValueOnce({allJobs: [
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                postedBy: 1, 
                status: 'pending',
                applicants: [1]
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });
    
    test('Jobs component renders correctly', async () => {

        await act(async () => {render(
                    <UserContext.Provider value={userValue}>
                        <Jobs />
                    </UserContext.Provider>
        )
        });

    });

    it("should match snapshot", async() => {

        expect.assertions(1)

        let asFragment;

        await act(async () => {const {asFragment: fragment} = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        asFragment = fragment;
        });

        expect(asFragment()).toMatchSnapshot();
    })

});



describe('tests the useEffect hooks upon render and data retrieval for workers', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
        getAllAvailableJobs.mockResolvedValueOnce({allJobs: [
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                postedBy: 1, 
                status: 'pending',
                applicants: [1]
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });
    
    test('Jobs hooks - first useEffect calls api to retrieve worker', async () => {

        expect.assertions(1);

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        expect(getSingleUser).toHaveBeenCalledTimes(1);

    });

    test('Jobs hooks - second useEffect calls api to retrieve jobs', async () => {

        expect.assertions(2);

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        expect(getSingleUser).toHaveBeenCalledTimes(1);
        expect(getAllAvailableJobs).toHaveBeenCalledTimes(1);

    });

    test('Jobs hooks - third useEffect creates jobCard(s) and sets loading to false', async () => {

        expect.assertions(2);

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        await waitFor(() => {
            const loadingSpinner = document.querySelector('.spinner');
            const jobCard = document.querySelector('.jobCard-card');
            expect(loadingSpinner).not.toBeInTheDocument();
            expect(jobCard).toBeInTheDocument();
        })
    });

});

describe('tests the useEffect hooks upon render and data retrieval for users', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false}});
        getActiveUserJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, 
                title: 'testing jobs 1', 
                body: 'job 1 body for testing the job card', 
                postedBy: 1, 
                status: 'active',
                applicants: []
            }, 
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                postedBy: 1, 
                status: 'pending',
                applicants: [1]
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });
    
    test('Jobs hooks - first useEffect calls API to retrieve user', async () => {

        expect.assertions(1);

        await act(async () => {render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        expect(getSingleUser).toHaveBeenCalledTimes(1);

    });

    test('Jobs hooks - second useEffect calls API to retrieve jobs', async () => {

        expect.assertions(1);

        await act(async () => {render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        expect(getActiveUserJobs).toHaveBeenCalledTimes(1);

    });

    test('Jobs hooks - third useEffect creates jobCard(s)', async () => {

        expect.assertions(1);

        await act(async () => {render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        await waitFor(() => {
            const jobCard = document.querySelector('.jobCard-card');
            expect(jobCard).toBeInTheDocument();
        })

    });

});


describe('tests the createJobCards function following api calls to retrieve job data for workers', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
        getAllAvailableJobs.mockResolvedValueOnce({allJobs: [
            {
                id: 1, 
                title: 'testing jobs 1',
                body: 'job 1 body for testing the job card',
                posted_by: 2,
                status: 'active',
                applicants: []
            }, 
            {
                id: 2, 
                title: 'testing jobs 2',
                body: 'job 2 body',
                posted_by: 1,
                status: 'pending',
                applicants: [1]
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });

    test('applications button calls api to get all jobs to which worker has applied and creates job cards from returned data', 
        async () => {

            expect.assertions(5);

            let renderResult;

            await act(async () => {renderResult = render(
                <UserContext.Provider value={userValue}>
                    <Jobs />
                </UserContext.Provider>
            )
            });
            const { container } = renderResult;

            expect(getAllAvailableJobs).toHaveBeenCalledTimes(1);

            const btn = screen.queryByTestId('applications-menu-item')
            expect(btn).toBeInTheDocument();


            await act(async () => {
                getAppliedWorkerJobs.mockResolvedValueOnce({appliedJobs: [
                    {
                        id: 2,
                        title: 'testing jobs 2',
                        body: 'job 2 body',
                        postedBy: 1,
                        status: 'pending',
                        applicants: [1]
                    }
                ]});

                fireEvent.click(btn)
            })


            expect(getAppliedWorkerJobs).toHaveBeenCalledTimes(1);


            expect(container).not.toHaveTextContent('testing jobs 1');
            expect(container).toHaveTextContent('testing jobs 2');
        
        

    });

    test('my jobs button calls api to get all jobs assigned to worker and creates job cards from returned data', async () => {

        expect.assertions(7);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and job 2
        expect(getAllAvailableJobs).toHaveBeenCalledTimes(1);
        expect(container).toHaveTextContent('testing jobs 1');
        expect(container).toHaveTextContent('testing jobs 2');
        

        // click the button
        const btn = screen.queryByTestId('my-jobs-menu-item');
        expect(btn).toBeInTheDocument();

        await act( async () => {
            getAllAssignedWorkerJobs.mockResolvedValueOnce({assignedJobs: [
                {
                    id: 1, 
                    title: 'testing jobs 1',
                    body: 'job 1 body for testing the job card',
                    postedBy: 2,
                    status: 'active',
                    assignedTo: 1,
                    applicants: []
                }
            ]});
            
            fireEvent.click(btn);
        })
        
        expect(getAllAssignedWorkerJobs).toHaveBeenCalledTimes(1);
        // should now show job 2 and not job 1
        expect(container).toHaveTextContent('testing jobs 1');
        expect(container).not.toHaveTextContent('testing jobs 2');
    });

    test('available jobs button calls api to get all available jobs for worker and creates job cards from returned data', 
        async () => {

            expect.assertions(8);

            let renderResult;

            await act(async () => {renderResult = render(
                <UserContext.Provider value={userValue}>
                    <Jobs />
                </UserContext.Provider>
            )
            });
            const { container } = renderResult;

            // should show job 1 and job 2
            expect(container).toHaveTextContent('testing jobs 1');
            expect(container).toHaveTextContent('testing jobs 2');

            // click the my jobs button
            const myJobsBtn = screen.queryByTestId('my-jobs-menu-item');
            expect(myJobsBtn).toBeInTheDocument();

            await act( async () => {
                getAllAssignedWorkerJobs.mockResolvedValueOnce({assignedJobs: [
                    {
                        id: 1, 
                        title: 'testing jobs 1',
                        body: 'job 1 body for testing the job card',
                        posted_by: 2,
                        assigned_to: 1,
                        status: 'pending',
                        applicants: []
                    }
                ]});
                fireEvent.click(myJobsBtn);
            })

            expect(getAllAssignedWorkerJobs).toHaveBeenCalledTimes(1);
            // click the available jobs button
            const availableJobsBtn = screen.queryByTestId('available-jobs-menu-item');
            expect(availableJobsBtn).toBeInTheDocument();

            await act( async () => {
                getAllAvailableJobs.mockResolvedValueOnce({allJobs: [
                    {
                        id: 1, 
                        title: 'testing jobs 1',
                        body: 'job 1 body for testing the job card',
                        posted_by: 2,
                        status: 'pending',
                        applicants: []
                    }
                ]});
                fireEvent.click(availableJobsBtn);
            })

            // should have called api to getAllAvailableJobs twice, once at the render and once on button click
            expect(getAllAvailableJobs).toHaveBeenCalledTimes(2);

            // should now show job 1 and not job 2
            expect(container).toHaveTextContent('testing jobs 1');
            expect(container).not.toHaveTextContent('testing jobs 2');
    
       
    });

});

describe('tests the createJobCards function following api calls to retrieve job data for users', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false}});
        getActiveUserJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, 
                title: 'testing jobs 1', 
                body: 'job 1 body for testing the job card', 
                postedBy: 1, 
                status: 'active',
                applicants: []
            }, 
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                postedBy: 1, 
                status: 'active',
                applicants: []
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });

    test('initial render for user calls api to get jobs posted by user and creates job cards from returned data', async () => {

        expect.assertions(3);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        expect(getActiveUserJobs).toHaveBeenCalledTimes(1);
        expect(container).toHaveTextContent('testing jobs 1');
        expect(container).toHaveTextContent('testing jobs 2');
        

    });

    test('pending review button calls api to get users completed jobs and creates job cards from returned data', async () => {

        expect.assertions(6);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;


        expect(container).toHaveTextContent('testing jobs 1');
        expect(container).toHaveTextContent('testing jobs 2');
        expect(container).not.toHaveTextContent('testing jobs 3');

        // click the button
        const button = screen.getByTestId('pending-review-menu-item');

        await act(async () => {
            getPendingReviewUserJobs.mockResolvedValueOnce({pendingReviewUserJobs: [
            {
                id: 3, 
                title: 'testing jobs 3', 
                body: 'job 3 body', 
                postedBy: 2, 
                status: 'pending review',
                applicants: []
            }]});

            fireEvent.click(button);
        })
        
        // should now show job 3 and not job 1 or 2
        expect(container).toHaveTextContent('testing jobs 3');
        expect(container).not.toHaveTextContent('testing jobs 1');
        expect(container).not.toHaveTextContent('testing jobs 2');
    });

});


describe('tests the jobCard integration for workers', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
        getAllAvailableJobs.mockResolvedValueOnce({allJobs: [
            {
                id: 1, 
                title: 'testing jobs 1', 
                body: 'job 1 body for testing the job card', 
                postedBy: 1, 
                status: 'active',
                applicants: []
            }, 
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                postedBy: 1, 
                status: 'pending',
                applicants: []
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });


    test('should show sliced job body to 30 characters', async () => {

        expect.assertions(2);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        
        expect(container).toHaveTextContent('job 1 body for testing the job...');
        expect(container).not.toHaveTextContent('job 1 body for testing the job card');

    });

});

describe('tests the jobCard integration for users', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false}});
        getActiveUserJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, 
                title: 'testing jobs 1', 
                body: 'job 1 body for testing the job card', 
                posted_by: 1,
                before_image_url: 'test before image 1',
                after_image_url: '', 
                after: 'test after image', 
                status: 'active',
                applicants: []
            }, 
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                posted_by: 1,
                before_image_url: 'test before image 2',
                after_image_url: '',
                status: 'active',
                applicants: []
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });


    test('should show sliced job body to 30 characters', async () => {

        expect.assertions(3);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and not job 2
        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
        })

        expect(container).toHaveTextContent('job 1 body for testing the job...');
        expect(container).not.toHaveTextContent('job 1 body for testing the job card');

    });

    test('should render job details', async () => {

        expect.assertions(3);
        

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and not job 2
        expect(container).toHaveTextContent('testing jobs 1');
        

        const jobCard = document.querySelector('.jobCard-card')
        expect(jobCard).toBeInTheDocument();

        await act(async () => {
            getBeforeImage.mockResolvedValueOnce({preSignedUrl: 'presigned_before'});
            getActiveUserJobs.mockResolvedValueOnce({jobs: [
                {
                    id: 1, 
                    title: 'testing jobs 1', 
                    body: 'job 1 body for testing the job card', 
                    posted_by: 1,
                    before_image_url: 'test before image 1',
                    after_image_url: '', 
                    after: 'test after image', 
                    status: 'active',
                    applicants: []
                }]});
                getSingleUser.mockResolvedValueOnce({user: {id: 1, firstName: "Joe", lastName: "D.", isWorker: false}});
            // click the jobCard
            fireEvent.click(jobCard);
        })
        

        // should show job details card
        const jobDetails = screen.getByTestId('jobDetails-card');
        expect(jobDetails).toBeInTheDocument();

    });

});


describe('tests the createJob function integration', () => {

    beforeEach(() => {
        
        getActiveUserJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, title: 'testing jobs 1', 
                body: 'job 1 body for testing the job card', 
                postedBy: 1, 
                status: 'pending',
                applicants: []
            }, 
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                postedBy: 1, 
                status: 'pending',
                applicants: []
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });

    test('create job button does not render for worker', async () => {

        expect.assertions(1);

        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true}});
        getAllAvailableJobs.mockResolvedValueOnce({allJobs: [
            {
                id: 1, 
                title: 'testing jobs 1', 
                body: 'job 1 body for testing the job card', 
                postedBy: 1, 
                status: 'active',
                applicants: []
            }, 
            {
                id: 2, 
                title: 'testing jobs 2', 
                body: 'job 2 body', 
                postedBy: 1, 
                status: 'pending',
                applicants: []
            }
        ]});
        
        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // button should not be rendered
        expect(container).not.toHaveTextContent('Create New Job');
    

    });

    test('create job button renders for user', async () => {

        expect.assertions(1);

        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false}});

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // button should be rendered
        expect(container).toHaveTextContent('Create New Job');
   

    });

    test('create job button reveals createJob form', async () => {

        // expect.assertions(9);

        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false, applications: []}});
        getActiveUserJobs.mockResolvedValueOnce({jobs: [{}]});



        await act(async () => {render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        
        // the form should not be visible
        expect(screen.queryByTestId("createJob-form-container")).not.toBeInTheDocument();

        const button = screen.getByTestId("jobs-create-job-button");

        // click the create job button
        await act(async () => {
            getActiveUserJobs.mockResolvedValueOnce({jobs: [{}]});
            fireEvent.click(button);
        })

        // the form should now be visible
        expect(screen.getByTestId("createJob-form-title-input")).toBeInTheDocument();

    });

});
