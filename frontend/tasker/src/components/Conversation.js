import React, {useEffect, useState, useRef} from 'react';
import NewMessageForm from './NewMessageForm.js';
import { ModalBody, ModalHeader } from 'reactstrap';
import "./styles/Conversation.css";


const Conversation = ({user, currUser, messages, jobId, onMessageSent, convoId, onClose}) => {

    const [convoTitle, setConvoTitle] = useState('');
    
    // ref for the message container
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        // When messages change, scroll to the bottom of the container
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        // sets the title of the conversation based on the user being conversed with
        setConvoTitle(generateConvoTitle(user));
        
    }, [])

    /** Returns user's name in format '<first_namm> <last_initial>.' */
    const generateConvoTitle = (user) => {
        return `${user.firstName} ${user.lastName.slice(0, 1) + "."}`
    }

    return (
        <div className="convo-container">
            <div className="convo-centered-card">
            {/* renders the name of the user that is being messaged as <first_name + last_name initial + '.'> */}
            <ModalHeader>{convoTitle}</ModalHeader>
            <ModalBody style={{ maxHeight: "700px", display: "flex", flexDirection: "column-reverse", overflowY: "auto"}}>
                <div className="convo-new-message-form">
                    <NewMessageForm 
                        convoId={convoId} 
                        assignedUser={user} 
                        currUser={currUser} 
                        jobId={jobId} 
                        onMessageSent={onMessageSent}
                        onClose={onClose}
                    />
                </div>

                <div 
                    className="convo-messages-container"
                    data-testid="convo-messages-container"
                    ref={messagesContainerRef}
                >
                    {messages}
                </div>
            
            </ModalBody>
            </div>
        </div>
    )
}

export default Conversation;