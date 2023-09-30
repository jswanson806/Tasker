import React, {useEffect, useState, useRef} from 'react';
import NewMessageForm from './NewMessageForm.js';
import { ModalBody, ModalHeader } from 'reactstrap';
import "./styles/Conversation.css";


const Conversation = ({user, currUser, messages, jobId, onMessageSent, convoId, onClose}) => {

    const [convoTitle, setConvoTitle] = useState('');

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        // When messages change, scroll to the bottom of the container
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        setConvoTitle(generateConvoTitle(user));
        
    }, [])


    const generateConvoTitle = (user) => {
        return `${user.firstName} ${user.lastName.slice(0, 1) + "."}`
    }
    

    return (
        <div className="convo-container">
            <div className="convo-centered-card">
            {/* renders the name of the user that is being messaged as <firstName + lastName initial + '.'> */}
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
                {/* displays the messages when messages[0] is truthy */}
                <div 
                    className="convo-messages-container"
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