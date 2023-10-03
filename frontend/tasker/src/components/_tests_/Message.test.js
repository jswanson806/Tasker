import React from "react";
import {act, render, screen, fireEvent, waitFor} from '@testing-library/react';
import TaskerApi from '../../api.js';
import Message from "../Message.js";

const onConvoClick = jest.fn();
const currUser = {id: 1};
const user = {id: 2, email: "email@test.com", firstName: "Joe", lastName: "Doe"}
const message1 = {id: 1, body: "test message 1 to test the message", sent_by: 2, sent_to: 1, is_read: false, convo_id: 'u1u2j1'};
const message2 = {id: 1, body: "test message 2", is_read: true};

const updateMessage = jest.spyOn(TaskerApi, 'updateMessage');
const getSingleMessage = jest.spyOn(TaskerApi, 'getSingleMessage');

describe('smoke and snapshot testing', () => {
    test('renders without crashing', async () => {
        await act(async () => {
            render(
                <Message
                    onConvoClick={onConvoClick}
                    currUser={currUser}
                    user={user}
                    preview={false}
                    message={message1}
                />
            );
        });

    });

    test('matches snapshot', async () => {
        let asFragment;

        await act(async () => {
            const {asFragment: fragment} = render(
                <Message
                    onConvoClick={onConvoClick}
                    currUser={currUser}
                    user={user}
                    preview={false}
                    message={message1}
                />
            );
            asFragment = fragment;
        });

        expect(asFragment).toMatchSnapshot();
    });

});

describe('unread message displays badge', () => {

    test('works - displays on unread message', async () => {

        await act(async () => {
            render(
                <Message
                    onConvoClick={onConvoClick}
                    currUser={currUser}
                    user={user}
                    preview={false}
                    message={message1} // is_read = false
                />
            );
        });

        const badge = screen.queryByText("New");
        expect(badge).toBeInTheDocument();

    });

    test('works - does not display on read messages', async () => {


        await act(async () => {
            render(
                <Message
                    onConvoClick={onConvoClick}
                    currUser={currUser}
                    user={user}
                    preview={false}
                    message={message2} //is_read = true
                />
            );

        });

        const badge = screen.queryByText("New");
        expect(badge).not.toBeInTheDocument();

    });

});

describe('preview message tests', () => {

    test('works - renders preview message', async () => {
        await act(async () => {
            render(
                <Message
                    onConvoClick={onConvoClick}
                    currUser={currUser}
                    user={user}
                    preview={true}
                    message={message1} // is_read = false
                />
            );
        });

        const bodyPreview = screen.queryByTestId("message-preview");
        const bodyFull = screen.queryByText("message-body")
        
        expect(bodyPreview).toBeInTheDocument();
        expect(bodyFull).not.toBeInTheDocument();
    });

    test('message preview click calls api with correct data', async () => {

        updateMessage.mockResolvedValueOnce('response');
        getSingleMessage.mockResolvedValueOnce( {id: 1, body: "test message 1 to test the message", sent_by: 2, sent_to: 1, is_read: true} );

        await act(async () => {
            render(
                <Message
                    onConvoClick={onConvoClick}
                    currUser={currUser}
                    user={user}
                    preview={true}
                    message={message1} // is_read = false
                />
            );
        });

        // click the message preview
        const bodyPreview = screen.queryByTestId("message-preview");
        fireEvent.click(bodyPreview);

        // data to update message with
        const messageUpdate = {message: {is_read: true}};

        await waitFor(() => {
            // call onConvoClick
            expect(onConvoClick).toHaveBeenCalledTimes(1);
            expect(onConvoClick).toHaveBeenCalledWith(user, currUser.id, message1.convo_id);
            // call api updateMessage
            expect(updateMessage).toHaveBeenCalledTimes(1);
            expect(updateMessage).toHaveBeenCalledWith(1, messageUpdate);
            // call api getSingleMessage
            expect(getSingleMessage).toHaveBeenCalledTimes(1);
            expect(getSingleMessage).toHaveBeenCalledWith(1);
        });
    });

});