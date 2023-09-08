import React, {useEffect, useState} from 'react';
import NewMessageForm from './NewMessageForm.js';


const Conversation = ({user, currUser, messages, jobId, onMessageSent, convoId}) => {

    const [convoTitle, setConvoTitle] = useState('');

    useEffect(() => {

        setConvoTitle(generateConvoTitle(user));
        
    }, [])


    const generateConvoTitle = (user) => {
        return `${user.firstName} ${user.lastName.slice(0, 1) + "."}`
    }
    

    return (
        <div className="convo-container">
            {/* renders the name of the user that is being messaged as <firstName + lastName initial + '.'> */}
            <h1>{convoTitle}</h1>
            <div className="convo-messages-container">
                {/* displays the messages when messages[0] is truthy */}
                <div>{messages}</div>

            </div>
            <div className="convo-new-message-form">
                <NewMessageForm 
                            convoId={convoId} 
                            assignedUser={user} 
                            currUser={currUser} 
                            jobId={jobId} 
                            onMessageSent={onMessageSent}
                />
            </div>
        </div>
        
    )
}

export default Conversation;