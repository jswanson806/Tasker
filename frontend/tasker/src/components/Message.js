import React, { useState } from "react";
import {Badge} from "reactstrap"
import TaskerApi from "../api";
import "./styles/Message.css";

const Message = ({message, preview, user, currUser, onConvoClick}) => {

    const [currMessage, setCurrMessage] = useState(message);

    const handleClick = async (user, currUserId, messageConvoId) => {
        onConvoClick(user, currUserId, messageConvoId);
        const messageUpdate = {message: {is_read: true}}
        try{ 

        const result = await TaskerApi.updateMessage(message.id, messageUpdate);
        if (result) {
            const messageRes = await TaskerApi.getSingleMessage(message.id);
            setCurrMessage(messageRes);
        }
        } catch(err) {
            console.error('Error: ', err)
        }
    }

    const bodyClassName = message.sent_by === currUser.id ? "message-container-right" : "message-container-left";

    return (
        <div className="message-container" data-testid="message-container">
            {!currMessage.is_read && currMessage.sent_by !== currUser.id && (<Badge color="info" pill>New</Badge>)}
            {!preview && (
            <div className={bodyClassName} data-testid="message-body">
                <p>{currMessage.body}</p>
                <small className="message-timestamp">{currMessage.created_at}</small>
            </div>)}
                
            {preview && (
                <div className="message-preview" data-testid={"message-preview"} 
                    onClick={() => handleClick(user, currUser.id, currMessage.convo_id)}
                >
                    <h4>{user.firstName} {user.lastName}</h4>
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