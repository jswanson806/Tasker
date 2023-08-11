import React from 'react';
import { render, act } from '@testing-library/react';
import Reviews from '../Reviews.js';
import { UserContext } from '../../helpers/UserContext.js';
import TaskerApi from '../../api.js';

const reviews = {reviews: [
    {   
        id: 1, 
        title: 'test review 1', 
        body: 'test review 1 body', 
        stars: 4, 
        reviewed_by: 2, 
        reviewed_for: 1
    }, 
    {
        id: 2, 
        title: 'test review 2', 
        body: 'test review 2 body', 
        stars: 3, 
        reviewed_by: 3, 
        reviewed_for: 1
    }
]};

const userValue = { user: '{"id": 1, "email": "test@email.com", "isWorker": true}' };

const getAllReviewsForUser = jest.spyOn(TaskerApi, 'getAllReviewsForUser');

describe("smoke and snapshot tests", () => {

    beforeEach(() => {
        getAllReviewsForUser.mockResolvedValueOnce(reviews)
    });

    afterEach(() => {
        jest.clearAllMocks();
    })
    
    test("should render without crashing", async () => {
        await act(async () => {render(
            <UserContext.Provider value={userValue} >
                <Reviews />
            </UserContext.Provider>
        )})
    }); 
    
    test("should match the snapshot", async () => {

        let asFragment;

        await act(async () => {const {asFragment: fragment} = render(
            <UserContext.Provider value={userValue} >
                <Reviews />
            </UserContext.Provider>
        )
        asFragment = fragment;
        });

        expect(asFragment()).toMatchSnapshot();
    });

});


describe("useEffect hooks", () => {

    beforeEach(() => {
        getAllReviewsForUser.mockResolvedValueOnce(reviews)
    });

    afterEach(() => {
        jest.clearAllMocks();
    })
    
    test("should call api to get reviews for user", async () => {
        await act(async () => {render(
            <UserContext.Provider value={userValue} >
                <Reviews />
            </UserContext.Provider>
        )})

        expect(getAllReviewsForUser).toHaveBeenCalledTimes(1);
        expect(getAllReviewsForUser).toHaveBeenCalledWith(1);
    });
    
    
    test("should call createReviewCards function - indirect test", async () => {

        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue} >
                <Reviews />
            </UserContext.Provider>
        )
        });
        
        const { container } = renderResult;
            
        expect(container).toHaveTextContent('test review 1');
        expect(container).toHaveTextContent('test review 2');

    });

});

describe('conditional rendering of reviews', () => {

    test("should show message if no reviews available", async () => {
        getAllReviewsForUser.mockResolvedValueOnce(null);
        let renderResult;

        await act(async () => {renderResult = render(
            <UserContext.Provider value={userValue} >
                <Reviews />
            </UserContext.Provider>
        )
        });
        
        const { container } = renderResult;
            
        expect(container).not.toHaveTextContent('test review 1');
        expect(container).not.toHaveTextContent('test review 2');
        expect(container).toHaveTextContent('No reviews yet!');

    });
    
});