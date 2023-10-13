import React, { useState } from "react";
import {Badge} from "reactstrap"
import TaskerApi from "../api";
import "./styles/Message.css";

const Message = ({message, preview, user, currUser, onConvoClick}) => {

    const [currMessage, setCurrMessage] = useState(message);
    /** Handles the click event on a conversation preview message
     * 
     * calls onConvoClick which calls fetchAndSetConversation from ConversationPreviews component
     * 
     * creates parital message update object to mark message as read
     * upon successful update, calls api to get the updated messsage from the api and 
     * updates state of currMessage
     */
    const handleClick = async (user, currUserId, messageConvoId) => {
        // call function passed from ConversationPreviews
        onConvoClick(user, currUserId, messageConvoId);
        // create partial updates message
        const messageUpdate = {message: {is_read: true}}
        try{ 
        // call api to update message
        const result = await TaskerApi.updateMessage(message.id, messageUpdate);
        if (result) { // if result is truthy
            // call api to get the updated message from the db
            const messageRes = await TaskerApi.getSingleMessage(message.id);
            // update currMessage state
            setCurrMessage(messageRes);
        }
        } catch(err) {
            console.error('Error: ', err)
        }
    }
    // determine which className should be assigned to the message based on who sent it
    const bodyClassName = message.sent_by === currUser.id ? "message-container-right" : "message-container-left";

    return (
        <div className="message-container" data-testid="message-container">
            {!currMessage.is_read && currMessage.sent_by !== currUser.id && (
                <Badge color="info" pill>New</Badge>
            )}
            {!preview && (
            // uses the bodyClassName variable to apply correct class, allowing message content to display on either left or right side
            <div className={bodyClassName} data-testid="message-body">
                <p>{currMessage.body}</p>
                <small className="message-timestamp">{currMessage.created_at}</small>
            </div>)}
                
            {preview && (
                <div className="message-preview" data-testid={"message-preview"} 
                    onClick={() => handleClick(user, currUser.id, currMessage.convo_id)}
                >
                    <h6>{user.firstName} {user.lastName}</h6>
                    <div className="message-preview-text">
                        <p>{currMessage.body.length > 120 ? currMessage.body.slice(0, 120) + '...' : currMessage.body}</p>
                    </div>
                    <div className="message-preview-timestamp">
                        <small>{currMessage.created_at}</small>
                    </div>
                </div>
            )}
        </div>
    )
};

export default Message;