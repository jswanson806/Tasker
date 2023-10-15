import React from "react";
import { render } from '@testing-library/react';
import Conversation from "../Conversation.js";
import "reactstrap";

const onClose = jest.fn();
const onMessageSent = jest.fn();

const currUser = {id: 1, first_name: "Joe", last_name: "Doe", email: "test@email.com", is_worker: true, applications: [1]};
const targetUser = {id: 2, first_name: "Jane", last_name: "Doe", email: "test@email.com", is_worker: false, applications: [1]};
const jobId = 1;

describe('smoke and snapshot tests', () => {

    test('Conversation component renders correctly', async () => {

        render(
            <Conversation 
                user={targetUser}
                currUser={currUser}
                jobId={jobId}
                onMessageSent={onMessageSent}
                convoId={'u1u2j1'}
                onClose={onClose}
            />
        );
    });

    test('Conversation component matches snapshot', async () => {

        const {asFragment} = render(
            <Conversation 
                user={targetUser}
                currUser={currUser}
                jobId={jobId}
                onMessageSent={onMessageSent}
                convoId={'u1u2j1'}
                onClose={onClose}
            />
        );
        expect(asFragment()).toMatchSnapshot();
    });

});

describe('useEffect hook - works', () => {

    test('sets conversation title correctly', async () => {

        const {container} = render(
            <Conversation 
                user={targetUser}
                currUser={currUser}
                jobId={jobId}
                onMessageSent={onMessageSent}
                convoId={'u1u2j1'}
                onClose={onClose}
            />
        );

        expect(container).not.toHaveTextContent("Jane Doe");
        expect(container).toHaveTextContent("Jane D.");
    });


});