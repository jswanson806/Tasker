import React, {useState} from "react";
import TaskerApi from "../api";

const NewMessageForm = ({convoId, assignedUser, currUser, jobId, onAction, onMessageSent}) => {
    
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

        if(onAction){
            handleClose(); 
        } else {
            onMessageSent(assignedUser, currUser.id, convoId);
        }

        setFormData(INITIAL_STATE);
    };


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    }

    const handleClose = () => {
        onAction();
    }
    

    return (
        <div className="convo-new-message-form">
            <form onSubmit={handleSubmit}>
                <label htmlFor="message">Message: </label>
                <input 
                    id="body"
                    type="text"
                    name="body"
                    placeholder="What's on your mind?"
                    data-testid="convo-message-input"
                    value={formData.body}
                    onChange={handleChange}
                />
                <button type="submit" data-testid="convo-form-button">Send</button>
            </form>
            {onAction && (<button onClick={handleClose}>Close</button>)}
        </div>
    )
}

export default NewMessageForm;