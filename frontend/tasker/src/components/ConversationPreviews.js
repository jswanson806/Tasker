import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api.js';
import Message from './Message.js';
import { UserContext } from '../helpers/UserContext.js';
import Conversation from './Conversation.js';
import { Modal, Spinner } from 'reactstrap';
import "./styles/ConversationPreviews.css";


const ConversationPreviews = () => {

    const {user} = useContext(UserContext);

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [convo, setConvo] = useState([]);
    const [showConvo, setShowConvo] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [targetUser, setTargetUser] = useState({});
    const [conversationId, setConversationId] = useState(null);
    const [triggerEffect, setTriggerEffect] = useState(false);

    const currUser = JSON.parse(user);
     

    useEffect(() => {
        // call function to get recent messages from unique conversations involving currUser
        fetchRecentMessagesInvolving(currUser.id);

    }, [triggerEffect]);

    useEffect(() => {
        if(convo[0]){
            setShowConvo(true);
        }
        
    }, [convo])


    async function fetchRecentMessagesInvolving(id) {
        try {
            // returns most recent messages from unique conversations
            const res = await TaskerApi.getMostRecentConvoMessagesInvolving(id);

            const {recentMessages} = res;

            // if recent messages returned a value, call function to set state of messages
            if(recentMessages){
                mapAndSetMessages(id, recentMessages);
            } else {
                setIsLoading(false);
            }
            
        } catch(err) {
            console.error(err);
        }
    }

    async function mapAndSetMessages(id, messages) {
        // set messages state by mapping messages and returning message components with necessary props
        const promises = messages.map( async (msg) => {
            // decide which user's id should used as the conversation target
            let user_id = msg.sent_by === id ? msg.sent_to : msg.sent_by;
            // get the conversation target user from the db
            let res = await TaskerApi.getSingleUser(user_id);
            let {user} = res;
            // return the message component with the target user passed as prop and preview set to 'true'
            return <Message 
                        key={msg.id} 
                        message={msg} 
                        preview={true} 
                        currUser={currUser} 
                        user={user} 
                        onConvoClick={fetchAndSetConversation}
                    />
        })

        // synchronous api call promises resolved
        const resultArray = await Promise.all(promises);

        // set the messages state
        setMessages(resultArray);

        // set is loading state
        setIsLoading(false);
    }

    async function fetchAndSetConversation(user, currUserId, conversationId) {
        try {

            const targetUser = user;
            const convoId = conversationId;
            let jobId;
            let res;

            if(typeof convoId === 'string'){
                jobId = await getTargetJobFromConvoId(conversationId);
                res = await TaskerApi.getConversationBetween(user.id, currUserId, jobId);
            } else {
                jobId = convoId;
                res = await TaskerApi.getConversationBetween(user.id, currUserId, jobId);
            }
            
            const {conversation} = res;

            if(conversation[0]) {
                setConversationId(jobId);
                setTargetUser(targetUser);
                setJobId(jobId);
                setConvo(conversation.map((msg) => {
                    return <Message 
                                key={msg.id} 
                                message={msg} 
                                preview={false} 
                                currUser={currUser} 
                                user={targetUser} 
                            />
                }));
            }
            setIsLoading(false);

        } catch(err) {
            console.error(err);
        }
    }

    async function getTargetJobFromConvoId(conversationId) {
        // set input string to argument value
        const inputString = conversationId;
        // set delimiter to character 'j' -> format of conversation_id is <u + user1Id + user2Id + j + jobId>
        const delimiter = 'j';
        // split the string on delimiter 'j'
        const convoIdParts = inputString.split(delimiter);
        // coerce second half of split string to Number and assign to 'jobId'
        const jobId = +convoIdParts[1];
        // return the jobId
        return jobId;
    }


    if(isLoading) {
        // default state of the page before asynchronous api calls are complete
        return (<Spinner>Loading...</Spinner>)
    }


    const handleClose = () => {
        // hides the conversation Modal
        setShowConvo(false);
        // triggers the useEffect
        setTriggerEffect(!triggerEffect);
    }


    return (
        <div className="convo-previews-container">
            <div className="convo-previews-messages-container">
                {/* displays the messages when messages[0] is truthy */}
                {messages[0] && !showConvo && (messages)}
                {/* if no messages, displays information to user */}
                {!messages[0] && !showConvo && (
                    <p>
                        No Messages. You can start a conversation with another user from an active job's detail page.
                    </p>
                )}
            </div>
            <div onClick={() => setShowConvo(true)}>
                <Modal 
                    isOpen={showConvo} 
                    toggle={() => setShowConvo(!showConvo)} 
                    style={{position: "relative", marginTop: "20%"}}
                >
                    <Conversation 
                            messages={convo} 
                            currUser={currUser} 
                            jobId={jobId} 
                            user={targetUser} 
                            onMessageSent={fetchAndSetConversation}
                            convoId={conversationId}
                            onClose={handleClose}
                    />
                </Modal>
            </div>
        </div>
        
    )
}

export default ConversationPreviews;