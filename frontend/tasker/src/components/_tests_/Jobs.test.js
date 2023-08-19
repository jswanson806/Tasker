import React from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import Jobs from '../Jobs.js';
import { UserContext } from '../../helpers/UserContext.js';
import TaskerApi from '../../api.js';


const userValue = { user: '{"id": 1, "email": "test@email.com", "isWorker": true}' };
const userValue2 = { user: '{"id": 1, "email": "test@email.com", "isWorker": false}' };

const getSingleUser = jest.spyOn(TaskerApi, 'getSingleUser')
const findAndFilterJobs = jest.spyOn(TaskerApi, 'findAndFilterJobs')
const applyToJob = jest.spyOn(TaskerApi, 'applyToJob')
const withdrawApplication = jest.spyOn(TaskerApi, 'withdrawApplication')

// describe('smoke and snapshot tests', () => {

//     beforeEach(() => {
//         getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
//         findAndFilterJobs.mockResolvedValueOnce({jobs: [
//             {
//                 id: 2, 
//                 title: 'testing jobs 2', 
//                 body: 'job 2 body', 
//                 postedBy: 1, 
//                 status: 'pending',
//                 applicants: [1]
//             }
//         ]});
        
//     });
      
//     afterEach(() => {
//       jest.clearAllMocks(); // Clears all mocked function calls
//     });
    
//     test('Jobs component renders correctly', async () => {

//         await act(async () => {render(
//             <UserContext.Provider value={userValue}>
//                 <Jobs />
//             </UserContext.Provider>
//         )
//         });

//     });

//     it("should match snapshot", async() => {

//         expect.assertions(1)

//         let asFragment;

//         await act(async () => {const {asFragment: fragment} = render(
//             <UserContext.Provider value={userValue}>
//                 <Jobs />
//             </UserContext.Provider>
//         )
//         asFragment = fragment;
//         });

//         expect(asFragment()).toMatchSnapshot();
//     })

// });



// describe('useEffect hooks - worker', () => {

//     beforeEach(() => {
//         getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
//         findAndFilterJobs.mockResolvedValueOnce({jobs: [
//             {
//                 id: 2, 
//                 title: 'testing jobs 2', 
//                 body: 'job 2 body', 
//                 postedBy: 1, 
//                 status: 'pending',
//                 applicants: [1]
//             }
//         ]});
        
//     });
      
//     afterEach(() => {
//       jest.clearAllMocks(); // Clears all mocked function calls
//     });
    
//     test('Jobs hooks - first useEffect', async () => {

//         expect.assertions(2);

//         await act(async () => {render(
//             <UserContext.Provider value={userValue}>
//                 <Jobs />
//             </UserContext.Provider>
//         )
//         });

//         expect(getSingleUser).toHaveBeenCalledTimes(1);
//         expect(findAndFilterJobs).toHaveBeenCalledTimes(1);

//     });

//     test('Jobs hooks - second useEffect creates jobCard(s)', async () => {

//         expect.assertions(1);

//         await act(async () => {render(
//             <UserContext.Provider value={userValue}>
//                 <Jobs />
//             </UserContext.Provider>
//         )
//         });

//         await waitFor(() => {
//             const jobCard = document.querySelector('.jobCard-card');
//             expect(jobCard).toBeInTheDocument();
//         })

//     });

// });

// describe('useEffect hooks - user', () => {

//     beforeEach(() => {
//         getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false}});
//         findAndFilterJobs.mockResolvedValueOnce({jobs: [
//             {
//                 id: 1, 
//                 title: 'testing jobs 1', 
//                 body: 'job 1 body for testing the job card', 
//                 postedBy: 1, 
//                 status: 'active',
//                 applicants: []
//             }, 
//             {
//                 id: 2, 
//                 title: 'testing jobs 2', 
//                 body: 'job 2 body', 
//                 postedBy: 1, 
//                 status: 'pending',
//                 applicants: [1]
//             }
//         ]});
        
//     });
      
//     afterEach(() => {
//       jest.clearAllMocks(); // Clears all mocked function calls
//     });
    
//     test('Jobs hooks - first useEffect', async () => {

//         expect.assertions(2);

//         await act(async () => {render(
//             <UserContext.Provider value={userValue2}>
//                 <Jobs />
//             </UserContext.Provider>
//         )
//         });

//         expect(getSingleUser).toHaveBeenCalledTimes(1);
//         expect(findAndFilterJobs).toHaveBeenCalledTimes(1);

//     });

//     test('Jobs hooks - second useEffect creates jobCard(s)', async () => {

//         expect.assertions(1);

//         await act(async () => {render(
//             <UserContext.Provider value={userValue2}>
//                 <Jobs />
//             </UserContext.Provider>
//         )
//         });

//         await waitFor(() => {
//             const jobCard = document.querySelector('.jobCard-card');
//             expect(jobCard).toBeInTheDocument();
//         })

//     });

// });


describe('createJobCards filtering - worker', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
        findAndFilterJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, title: 'testing jobs 1',
                body: 'job 1 body for testing the job card',
                postedBy: 2,
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

    test('job cards are filtered based on user applications', async () => {

        expect.assertions(3);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        const btn = screen.getByTestId('jobs-worker-applications-button')

        

        await act(async () => {
            findAndFilterJobs.mockResolvedValueOnce({jobs: [
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

        expect(findAndFilterJobs).toHaveBeenCalledTimes(2);

        
        expect(container).not.toHaveTextContent('testing jobs 1');
        expect(container).toHaveTextContent('testing jobs 2');
        
        

    });

    test('button shows my jobs', async () => {

        expect.assertions(4);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and not job 2
        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
            expect(container).toHaveTextContent('testing jobs 2');
        })

        // click the button
        const button = screen.getByTestId('jobs-worker-my-jobs-button');

        await act( async () => {
            findAndFilterJobs.mockResolvedValueOnce({jobs: [
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
            
            fireEvent.click(button);
        })
        
        
        // should now show job 2 and not job 1
        expect(container).toHaveTextContent('testing jobs 1');
        expect(container).not.toHaveTextContent('testing jobs 2');
    });

});

describe('createJobCards filtering - user', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false}});
        findAndFilterJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, title: 'testing jobs 1', 
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
            },
            {
                id: 3, 
                title: 'testing jobs 3', 
                body: 'job 3 body', 
                postedBy: 2, 
                status: 'complete'
            }
        ]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });

    test('job cards are filtered based on job.postedBy && status', async () => {

        // expect.assertions(2);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
            expect(container).toHaveTextContent('testing jobs 2');
            expect(container).not.toHaveTextContent('testing jobs 3');
        })

    });

    test('button shows pending jobs', async () => {

        expect.assertions(6);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
            expect(container).toHaveTextContent('testing jobs 2');
            expect(container).not.toHaveTextContent('testing jobs 3');
        })

        // click the button
        const button = screen.getByTestId('jobs-user-my-jobs-button');
        
        await act(async () => {
            findAndFilterJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, title: 'testing jobs 1', 
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
            }]});

            fireEvent.click(button);
        })
        
        // should now show job 2 and not job 1
        expect(container).toHaveTextContent('testing jobs 2');
        expect(container).toHaveTextContent('testing jobs 1');
        expect(container).not.toHaveTextContent('testing jobs 3');
    });

    test('button shows complete jobs', async () => {

        expect.assertions(6);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue2}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
            expect(container).toHaveTextContent('testing jobs 2');
            expect(container).not.toHaveTextContent('testing jobs 3');
        })

        // click the button
        const button = screen.getByTestId('jobs-user-completed-button');

        await act(async () => {
            findAndFilterJobs.mockResolvedValueOnce({jobs: [
            {
                id: 3, 
                title: 'testing jobs 3', 
                body: 'job 3 body', 
                postedBy: 2, 
                status: 'complete',
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


describe('jobCard integration - worker', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
        findAndFilterJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, title: 'testing jobs 1', 
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

        expect.assertions(3);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
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

    test('should show/hide job details', async () => {

        expect.assertions(3);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and not job 2
        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
        })


        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        // should show job details card
        const jobDetails = screen.getByTestId('jobDetails-card');
        expect(jobDetails).toBeInTheDocument();
        expect(container).toHaveTextContent('job 1 body for testing the job card');

    });

});

describe('jobCard integration - user', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false}});
        findAndFilterJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, title: 'testing jobs 1', 
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

    test('should show/hide job details', async () => {

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


        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        // should show job details card
        const jobDetails = screen.getByTestId('jobDetails-card');
        expect(jobDetails).toBeInTheDocument();
        expect(container).toHaveTextContent('job 1 body for testing the job card');

    });

});


describe('jobDetails integration - worker', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
        findAndFilterJobs.mockResolvedValueOnce({jobs: [
            {
                id: 1, 
                title: 'testing jobs 1', 
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
                applicants: [1]
            }
        ]});
        applyToJob.mockResolvedValueOnce('');
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });

    test('close button hides details', async () => {

        expect.assertions(3);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and not job 2
        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
        })

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

        expect.assertions(5);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and not job 2
        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
        })

        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        // should show job details card
        expect(container).toHaveTextContent('job 1 body for testing the job card');

        const applyButton = screen.getByTestId('jobDetails-apply-button')

        // click 'apply' and wait for state update
        await act(async () => {
            fireEvent.click(applyButton);
            getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2, 1]}})
            findAndFilterJobs.mockResolvedValueOnce({jobs: [
                {
                    id: 1, 
                    title: 'testing jobs 1', 
                    body: 'job 1 body for testing the job card', 
                    postedBy: 1, 
                    status: 'pending',
                    applicants: [1]
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
        })

        // should make API call with correct data
        expect(applyToJob).toHaveBeenCalledTimes(1);
        expect(applyToJob).toHaveBeenCalledWith(1, 1);
        
        // should have hidden the job details after applying
        expect(container).not.toHaveTextContent('job 1 body for testing the job card')
    });

    test('withdraw button calls withdrawApplication and hides details', async () => {

        expect.assertions(5);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        // should show job 1 and not job 2
        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
        })

        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        const applyButton = screen.getByTestId('jobDetails-apply-button')

        // click 'apply' and wait for state update
        await act(async () => {
            fireEvent.click(applyButton);
            getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2, 1]}});
            findAndFilterJobs.mockResolvedValueOnce({jobs: [
                {
                    id: 1, 
                    title: 'testing jobs 1', 
                    body: 'job 1 body for testing the job card', 
                    postedBy: 1, 
                    status: 'pending',
                    applicants: [1]
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
        })

        // should make API call to apply to job
        expect(applyToJob).toHaveBeenCalledTimes(1);

        // click the jobCard
        fireEvent.click(jobCard);

        const withdrawButton = screen.getByTestId('jobDetails-withdraw-button')

        // click 'withdraw' and wait for state update
        await act(async () => {
            fireEvent.click(withdrawButton);
            getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true, applications: [2]}});
            findAndFilterJobs.mockResolvedValueOnce({jobs: [
                {
                    id: 1, 
                    title: 'testing jobs 1', 
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
                    applicants: [1]
                }
            ]});
        })

        // should make API call with correct data
        expect(withdrawApplication).toHaveBeenCalledTimes(1);
        expect(withdrawApplication).toHaveBeenCalledWith(1, 1);
        
        // should have hidden the job details after withdrawing
        expect(container).not.toHaveTextContent('job 1 body for testing the job card')
    });

});

describe('jobDetails integration - user', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false, applications: []}});
        findAndFilterJobs.mockResolvedValueOnce({jobs: [
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

    test('close button hides details', async () => {

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

        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        // should show job details card
        expect(container).toHaveTextContent('job 1 body for testing the job card');

        const closeButton = screen.getByTestId('jobDetails-close-button')

        // click 'apply' and wait for state update
        await act(async () => {
            fireEvent.click(closeButton);
        })
        
        // should have hidden the job details after applying
        expect(container).not.toHaveTextContent('job 1 body for testing the job card')
    });

    test('apply button is not rendered', async () => {

        expect.assertions(4);

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

        const jobCard = document.querySelector('.jobCard-card');

        // click the jobCard
        fireEvent.click(jobCard);

        // should show job details card
        expect(container).toHaveTextContent('job 1 body for testing the job card');
        // should have hidden the job details after applying
        expect(container).toHaveTextContent('Close')
        expect(container).not.toHaveTextContent('Apply')
    });

});


describe('createJob integration', () => {

    beforeEach(() => {
        
        findAndFilterJobs.mockResolvedValueOnce({jobs: [
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

    test('does not render for worker', async () => {

        expect.assertions(1);

        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: true}});
        
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

    test('renders for user', async () => {

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

    test('button reveals createJob form', async () => {

        // expect.assertions(9);

        getSingleUser.mockResolvedValueOnce({user: {id: 1, isWorker: false, applications: []}});
        findAndFilterJobs.mockResolvedValueOnce({jobs: [{}]});



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
            findAndFilterJobs.mockResolvedValueOnce({jobs: [{}]});
            fireEvent.click(button);
        })

        // the form should now be visible
        expect(screen.getByTestId("createJob-form-title-input")).toBeInTheDocument();

    });

});
