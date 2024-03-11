import React, { useContext, useEffect, useState } from 'react';
import TaskerApi from '../api.js';
import Message from './Message.js';
import { UserContext } from '../helpers/UserContext.js';
import Conversation from './Conversation.js';
import { Modal, Spinner } from 'reactstrap';
import "./styles/ConversationPreviews.css";

/** ConversationPreviews component
 * 
 * Renders a preview of the most recent messages by unique id (conversations)
 * 
 * Conversations are tied to specific job id's rather than specific users, 
 *  so it is possible to have separate conversations between two users if 
 *  the worker was hired by the same user on multiple jobs.
 * 
 * Preview messages show the latest message and are limited to 120 characters 
 * The recipient name is displayed as well as the date/time of the most recent message
 * 
 * Manages state of messages, isLoading, convo, showConvo, jobId, targetUser, and triggerEffect
 * 
 * Maps messages to Message components
 * 
 * Renders Conversation component in a Modal when a conversation preview is clicked
 */

const ConversationPreviews = () => {

    const {user} = useContext(UserContext);

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [convo, setConvo] = useState([]);
    const [showConvo, setShowConvo] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [targetUser, setTargetUser] = useState({});
    const [triggerEffect, setTriggerEffect] = useState(false);

    const currUser = JSON.parse(user);
     

    useEffect(() => {
        // call function to get recent messages from unique conversations involving currUser
        fetchRecentMessagesInvolving(currUser.id);
        // triggerEffect is used by the handleClose function in this component to refresh the conversation preview messages
    }, [triggerEffect]);

    useEffect(() => {
        // when convo is populated, show the conversation modal
        if(convo[0]){
            setShowConvo(true);
        }
        // convo is used to trigger this useEffect and update the showConvo state
    }, [convo])


    /** Calls api to retrieve all most recent messages from each unique conversation involving the user with matching 'id' 
     * 
     * If recent messages are returned, call function to update messages state
     * 
     * Sets isLoading to false if recent messages are not returned, allowing message in JSX to render
    */
    async function fetchRecentMessagesInvolving(id) {
        try {
            // returns most recent messages from unique conversations
            const res = await TaskerApi.getMostRecentConvoMessagesInvolving(id);
            // destructure recentMessages array from api response
            const {recentMessages} = res;
            // if recent messages returned a value, call function to set state of messages
            if(recentMessages){
                mapAndSetMessages(id, recentMessages);
            } else {
                // update isLoading state
                setIsLoading(false);
            }
            
        } catch(err) {
            console.error(err);
        }
    }

    /** Maps Message components and updates state of messages and isLoading
     * 
     * Determines which user is the conversation target (either the one sending or receiving based on currently logged in user)
     * 
     * Calls api to retrieve each user who is target of conversation
     * 
     * Returns Message component with conversation target user passed in props and preview set to true
     * 
     * Updates state of messages and isLoading 
     * 
    */
    async function mapAndSetMessages(id, messages) {
        try{
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
        } catch(err) {
            console.error(err);
        }
    }

    /** Calls api to retrieve the full conversation history betweeen two specific users
     * 
     * Updates state of conversationId, targetUser, jobId, convo, and isLoading
    */
    async function fetchAndSetConversation(user, currUserId, conversationId) {
        try {

            const targetUser = user;
            const convoId = conversationId;
            let jobId;
            let res;

            if(typeof convoId === 'string'){
                jobId = getTargetJobFromConvoId(conversationId);
                res = await TaskerApi.getConversationBetween(user.id, currUserId, jobId);
            } else {
                jobId = convoId;
                res = await TaskerApi.getConversationBetween(user.id, currUserId, jobId);
            }

            const {conversation} = res;

            // if conversation was returned
            if(conversation[0]) {

                // update targetUser state
                setTargetUser(targetUser);
                // update jobId state
                setJobId(jobId);
                // map messages update convo state with array of Message components
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
            // update isLoading state even if conversation is not returned
            setIsLoading(false);

        } catch(err) {
            console.error(err);
        }
    }

    function getTargetJobFromConvoId(conversationId) {
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

    /** Updates state of showConvo to hide the modal
     * 
     * Triggers the useEffect to refresh component and update the message previews
    */
    const handleClose = () => {
        // hides the conversation Modal
        setShowConvo(false);
        // triggers the useEffect
        setTriggerEffect(!triggerEffect);
    }

    if(isLoading){
        return (
        <div className="spinner">
            <Spinner>
                Loading...
            </Spinner>
        </div>
          )
    }

    return (
        <>
        <div className="convo-header-container">
            <h3>Messages</h3>
        </div>
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
                            onClose={handleClose}
                    />
                </Modal>
            </div>
        </div>
        </>
    )
}

export default ConversationPreviews;