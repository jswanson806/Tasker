import React from "react";
import { render, act, waitFor, screen, fireEvent} from '@testing-library/react';
import ConversationPreviews from "../ConversationPreviews.js";
import "reactstrap";
import { UserContext } from "../../helpers/UserContext.js";
import TaskerApi from "../../api.js";

const userValue = {user: '{"id": 1, "email": "test@email.com", "isWorker": true}'};

const getMostRecentConvoMessagesInvolving = jest.spyOn(TaskerApi, 'getMostRecentConvoMessagesInvolving');
const getSingleUser = jest.spyOn(TaskerApi, 'getSingleUser');
const getConversationBetween = jest.spyOn(TaskerApi, 'getConversationBetween');
const updateMessage = jest.spyOn(TaskerApi, 'updateMessage');

beforeEach(() => {
    getMostRecentConvoMessagesInvolving.mockResolvedValueOnce({recentMessages: [
        {
            id: 1, 
            sent_by: 1, 
            sent_to: 2, 
            body: 'Message 1'
        }, 
        {
            id: 2, 
            sent_by: 2, 
            sent_to: 1, 
            body: 'Message 2'
        }]});

    getSingleUser.mockResolvedValueOnce({user: {id: 1, email: "test1@email.com", isWorker: true}})
    getSingleUser.mockResolvedValueOnce({user: {id: 2, email: "test2@email.com", isWorker: true}})
    getConversationBetween.mockResolvedValueOnce({conversation:{}})
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('snapshot and smoke tests', () => {
    
    test('renders without crashing', async () => {
        
        await act(async () => {
            render(
                <UserContext.Provider value={userValue}>
                    <ConversationPreviews />
                </UserContext.Provider>
            )
        });
    });

    test('matches the snapshot', async () => {
        let asFragment;

        await act(async () => { const {asFragment: fragment} = render(
            <UserContext.Provider value={userValue}>
                <ConversationPreviews />
            </UserContext.Provider>
        )

            asFragment = fragment;
        
        expect(asFragment).toMatchSnapshot();
        })
    });
});

describe('useEffect Hook - calls getMostRecentConvoMessagesInvolving from api', () => {
    test('makes calls to api to retrieve recent messages and users', async () => {
        expect.assertions(2);

        await act(async () => {
            render(
                <UserContext.Provider value={userValue}>
                    <ConversationPreviews />
                </UserContext.Provider>
            )
        })

        await waitFor(() => {
            expect(getMostRecentConvoMessagesInvolving).toHaveBeenCalledTimes(1);
            expect(getSingleUser).toHaveBeenCalledTimes(2);
        })
            
    })
   
});

describe('useEffect Hook - calls getMostRecentConvoMessagesInvolving from api', () => {
    test('makes calls to api to retrieve recent messages and users', async () => {
        expect.assertions(2);

        await act(async () => {
            render(
                <UserContext.Provider value={userValue}>
                    <ConversationPreviews />
                </UserContext.Provider>
            )
        })

        await waitFor(() => {
            expect(getMostRecentConvoMessagesInvolving).toHaveBeenCalledTimes(1);
            expect(getSingleUser).toHaveBeenCalledTimes(2);
        })
            
    })
   
});

describe('renders child component correctly', () => {
    test('renders Conversation component and calls api method getConversationBetween', async () => {
        expect.assertions(3);

        await act(async () => {
            render(
                <UserContext.Provider value={userValue}>
                    <ConversationPreviews />
                </UserContext.Provider>
            )
        })

        await waitFor(() => {
            expect(getMostRecentConvoMessagesInvolving).toHaveBeenCalledTimes(1);
            expect(getSingleUser).toHaveBeenCalledTimes(2);
        })

        const convoCards = screen.getAllByTestId("message-preview");
        const convoBtn = convoCards[0];
        expect(convoBtn).toBeInTheDocument();
        
    });

    test('calls api method getConversationBetween and updateMessage when conversation preview is clicked', async () => {
        expect.assertions(6);

        getConversationBetween.mockResolvedValueOnce({conversation:{}})

        await act(async () => {
            render(
                <UserContext.Provider value={userValue}>
                    <ConversationPreviews />
                </UserContext.Provider>
            )
        })

        await waitFor(() => {
            expect(getMostRecentConvoMessagesInvolving).toHaveBeenCalledTimes(1);
            expect(getSingleUser).toHaveBeenCalledTimes(2);
        })

        const convoCards = screen.getAllByTestId("message-preview");
        const convoBtn = convoCards[0];
        expect(convoBtn).toBeInTheDocument();
        
        await act(async () => {
            fireEvent.click(convoBtn);
        });

        await waitFor(() => {
            const convoContainer = screen.queryAllByTestId("message-container");
            expect(convoContainer[0]).toBeInTheDocument();
        })
            expect(getConversationBetween).toHaveBeenCalledTimes(1);
            expect(updateMessage).toHaveBeenCalledTimes(1);

    });
   
});

