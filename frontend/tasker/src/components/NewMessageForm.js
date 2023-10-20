import React, {useState} from "react";
import TaskerApi from "../api";
import {Button, Form, FormGroup, Input, Label, ModalBody, ModalHeader} from "reactstrap";
import "./styles/NewMessageForm.css";

const NewMessageForm = ({assignedUser, currUser, jobId, onAction, onMessageSent, onClose}) => {
    
    const INITIAL_STATE = {
        body: '', 
        sent_by: '', 
        sent_to: '', 
        job_id: ''
    }

    const [formData, setFormData] = useState(INITIAL_STATE);

    /** Handles submission of the form
     * 
     * Creates message update object and calls api to create new message
     * 
     * Uses onAction prop passed from JobDetails or onMessageSent passed from ConversationPreviews depening on which parent is rendering
     * 
     * Resets form data to inital state
    */

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            // construct message object to create message in db
            let message = {message: {
                body: formData.body,
                sent_by: currUser.id, 
                sent_to: assignedUser.id, 
                job_id: jobId
            }}
            // call api to create message passing message object
            await TaskerApi.createMessage(message);

            if(onAction){ // onAction is passed from the JobDetails component
                // calls onAction from jobDetails, which hides the modal rendering NewMessageForm
                onAction(); 
            } else { // onAction was not passed, which means onMessageSent was passed from ConversationPreviews component
                // calls fetchAndSetConversation to get the latest messages in the conversation
                onMessageSent(assignedUser, currUser.id, jobId);
                // adjusts text area size
                const textarea = document.querySelector('#body');
                adjustTextareaHeight(textarea);
            }
            // clears the form
            setFormData(INITIAL_STATE);
        } catch(err) {
            console.error(err);
        }
    };

    /** Handles changes to the form input field 
     * 
     * Adjusts the text area and modal height as the user types
    */
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
        // adjusts textarea height dynamically
        adjustTextareaHeight(e.target);
        // adjusts modal height dynamically
        adjustModalHeight();
    }

    /** Dynamically adjusts the text area */
    const adjustTextareaHeight = (textarea) => {
        // Reset the height to auto
        textarea.style.height = 'auto';
        // Set the height to the scrollHeight
        textarea.style.height = textarea.scrollHeight + 'px'; 
      };
    
    /** Dynamically adjusts the modal height */
    const adjustModalHeight = () => {
        // get the elements that need to be adjusted
        const modalContent = document.querySelector('.centered-card');
        const modalContainer = document.querySelector('.new-message-container');
        const textarea = document.querySelector('#body');  

        if (modalContent && modalContainer && textarea) {
            modalContent.style.maxHeight = `${textarea.scrollHeight + 400}px`;
            modalContainer.style.maxHeight = `${textarea.scrollHeight + 400}px`;
      }
    };


    return (
        <div className="new-message-container">
            {/* this renders when being rendered from the JobDetails component */}
            {!onMessageSent && ( 
                <div className="centered-card">
                    <ModalHeader>New Message</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup row>
                            <Label htmlFor="body">Message: </Label>

                                <Input 
                                    id="body"
                                    className="text-input"
                                    type="textarea"
                                    name="body"
                                    placeholder="What's on your mind?"
                                    data-testid="convo-message-input"
                                    value={formData.body}
                                    onChange={handleChange}
                                    rows={1}
                                    style={{resize: 'none', overflowY: 'hidden'}}
                                />

                            </FormGroup>
                            <Button className="button" color="info" type="submit" data-testid="convo-form-button">Send</Button>
                            <Button className="button" color="danger" onClick={onAction} data-testid="convo-close-button">Close</Button>
                        </Form>
                    </ModalBody>
                </div>
            )}
            {/* this renders when being rendered from the Conversation component */}
            {onMessageSent && (
                <div className="new-message-centered-card">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                        <Label htmlFor="message">New Message: </Label>

                            <Input 
                                id="body"
                                className="text-input"
                                type="textarea"
                                name="body"
                                placeholder="What's on your mind?"
                                data-testid="convo-message-input"
                                value={formData.body}
                                onChange={handleChange}
                                rows={1}
                                style={{resize: 'none', overflowY: 'hidden'}}
                            />

                        </FormGroup>
                        <Button className="button" color="info" type="submit" data-testid="convo-form-button">Send</Button>
                        <Button className="button" color="danger" onClick={onClose} data-testid="convo-close-button">Close</Button>
                    </Form>
                </div>
            )}
    
        </div>

        
    )
}

export default NewMessageForm;