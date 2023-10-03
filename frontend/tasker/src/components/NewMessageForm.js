import React, {useState} from "react";
import TaskerApi from "../api";
import {Button, Col, Form, FormGroup, Input, Label, ModalBody, ModalHeader} from "reactstrap";
import "./styles/NewMessageForm.css";

const NewMessageForm = ({convoId, assignedUser, currUser, jobId, onAction, onMessageSent, onClose}) => {
    
    const INITIAL_STATE = {
        body: '', 
        sent_by: '', 
        sent_to: '', 
        job_id: ''
    }

    const [formData, setFormData] = useState(INITIAL_STATE);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let message = {message: {
            body: formData.body,
            sent_by: currUser.id, 
            sent_to: assignedUser.id, 
            job_id: jobId
        }}
        
        await TaskerApi.createMessage(message);

        if(onAction){ // onAction is passed from the JobDetails component
            handleClose(); 
        } else { // onAction was not passed, which means onMessageSent was passed from Conversation component
            onMessageSent(assignedUser, currUser.id, convoId);
            const textarea = document.querySelector('#body');
            adjustTextareaHeight(textarea);
        }

        setFormData(INITIAL_STATE);
    };


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
        adjustTextareaHeight(e.target);
        adjustModalHeight();
    }

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto'; // Reset the height to auto
        textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to the scrollHeight
      };

    const adjustModalHeight = () => {
        const modalContent = document.querySelector('.centered-card');
        const modalContainer = document.querySelector('.new-message-container');
        const textarea = document.querySelector('#body');  

        if (modalContent && modalContainer && textarea) {
            modalContent.style.maxHeight = `${textarea.scrollHeight + 400}px`; // Adjust as needed
            modalContainer.style.maxHeight = `${textarea.scrollHeight + 400}px`; // Adjust as needed
      }
    };

    const handleClose = () => {
        onAction();
    }
    

    return (
        <div className="new-message-container">
            {!onMessageSent && ( 
                <div className="centered-card">
                    <ModalHeader>New Message</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup row>
                            <Label htmlFor="message">Message: </Label>

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
                            <Button className="button" color="danger" onClick={() => onClose()} data-testid="convo-close-button">Close</Button>
                        </Form>
                    </ModalBody>
                </div>
            )}

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
                        <Button className="button" color="danger" onClick={() => onClose()} data-testid="convo-close-button">Close</Button>
                    </Form>
                </div>
            )}
    
        </div>

        
    )
}

export default NewMessageForm;