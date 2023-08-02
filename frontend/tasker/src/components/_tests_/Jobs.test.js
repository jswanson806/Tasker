import React from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import Jobs from '../Jobs.js';
import { UserContext } from '../../helpers/UserContext.js';
import TaskerApi from '../../api.js';


const userValue = { user: '{"id": 1, "email": "test@email.com", "isWorker": true}' };

const getSingleUser = jest.spyOn(TaskerApi, 'getSingleUser')
const getAllJobs = jest.spyOn(TaskerApi, 'getAllJobs')
const applyToJob = jest.spyOn(TaskerApi, 'applyToJob')

describe('smoke and snapshot tests', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2]}});
        getAllJobs.mockResolvedValueOnce({allJobs: [{id: 1, title: 'testing jobs 1', body: 'job 1 body for testing the job card'}, {id: 2, title: 'testing jobs 2', body: 'job 2 body'}]});
        
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



describe('useEffect hooks', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2]}});
        getAllJobs.mockResolvedValueOnce({allJobs: [{id: 1, title: 'testing jobs 1', body: 'job 1 body for testing the job card'}, {id: 2, title: 'testing jobs 2', body: 'job 2 body'}]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });
    
    test('Jobs hooks - first useEffect', async () => {

        expect.assertions(2);

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });

        expect(getSingleUser).toHaveBeenCalledTimes(1);
        expect(getAllJobs).toHaveBeenCalledTimes(1);

    });

    test('Jobs hooks - second useEffect creates jobCard(s)', async () => {

        expect.assertions(1);

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
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


describe('createJobCards filtering', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2]}});
        getAllJobs.mockResolvedValueOnce({allJobs: [{id: 1, title: 'testing jobs 1', body: 'job 1 body for testing the job card'}, {id: 2, title: 'testing jobs 2', body: 'job 2 body'}]});
        
    });
      
    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocked function calls
    });

    test('job cards are filtered based on user applications', async () => {

        expect.assertions(2);

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue}>
                <Jobs />
            </UserContext.Provider>
        )
        });
        const { container } = renderResult;

        await waitFor(() => {
            expect(container).toHaveTextContent('testing jobs 1');
            expect(container).not.toHaveTextContent('testing jobs 2');
        })

    });

    test('button shows/hides my jobs/all jobs', async () => {

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
            expect(container).not.toHaveTextContent('testing jobs 2');
        })

        // click the button
        const button = screen.getByTestId('jobs-button');
        fireEvent.click(button);
        
        // should now show job 2 and not job 1
        expect(container).toHaveTextContent('testing jobs 2');
        expect(container).not.toHaveTextContent('testing jobs 1');
    });

});


describe('jobCard integration', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2]}});
        getAllJobs.mockResolvedValueOnce({allJobs: [{id: 1, title: 'testing jobs 1', body: 'job 1 body for testing the job card'}, {id: 2, title: 'testing jobs 2', body: 'job 2 body'}]});
        
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


describe('jobDetails integration', () => {

    beforeEach(() => {
        getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2]}});
        getAllJobs.mockResolvedValueOnce({allJobs: [{id: 1, title: 'testing jobs 1', body: 'job 1 body for testing the job card'}, {id: 2, title: 'testing jobs 2', body: 'job 2 body'}]});
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

        // click 'apply' and wait for state update
        await act(async () => {
            fireEvent.click(closeButton);
        })
        
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
        })

        // should make API call with correct data
        expect(applyToJob).toHaveBeenCalledTimes(1);
        expect(applyToJob).toHaveBeenCalledWith(1, 1);
        
        // should have hidden the job details after applying
        expect(container).not.toHaveTextContent('job 1 body for testing the job card')
    });

    test('applying to job updates jobCards filtering', async () => {

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
            getSingleUser.mockResolvedValueOnce({user: {id: 1, applications: [2, 1]}})
        })
        
        // should no longer show job 1 or job 2
        expect(container).not.toHaveTextContent('testing jobs 1')
        expect(container).not.toHaveTextContent('testing jobs 2')

        // click the my jobs button
        const button = screen.getByTestId('jobs-button');
        fireEvent.click(button);

        // should now show job 1 and job 2
        expect(container).toHaveTextContent('testing jobs 1')
        expect(container).toHaveTextContent('testing jobs 2')
    });
});
