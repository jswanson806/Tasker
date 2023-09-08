import React from "react";

const Message = ({message, preview, user, currUser, onConvoClick}) => {

    const handleClick = (user, currUserId, messageConvoId) => {
        onConvoClick(user, currUserId, messageConvoId);
    }

    const bodyClassName = message.sent_by === currUser.id ? "message-container-right" : "message-container-left";


    return (
        <div className="message-container">
            {!preview && (
            <div className={bodyClassName}>
                <p>{message.body}</p>
                <small className="message-timestamp">{message.created_at}</small>
            </div>)}

            {preview && (
                <div className="message-preview" 
                    onClick={() => handleClick(user, currUser.id, message.convo_id)}
                >
                    <h4>{user.firstName} {user.lastName.slice(0,1 + ".")}</h4>
                    <p>{message.body.slice(30 + '...')}</p>
                    <small className="message-preview-timestamp">{message.created_at}</small>
                </div>
            )}
        </div>
    )
};

export default Message;