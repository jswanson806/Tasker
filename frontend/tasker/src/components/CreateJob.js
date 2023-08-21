import React, { useState, useContext } from "react";
import { UserContext } from "../helpers/UserContext";
import TaskerApi from "../api";

const CreateJob = () => {

    const INITIAL_STATE = {
        title: '',
        body: '',
        address: '',
        postedBy: '',
        before_image_url: '',
    }

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [visible, setVisible] = useState(true);
    const { user } = useContext(UserContext);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let jobInfo = {job: {
            title: formData.title,
            body: formData.body,
            address: formData.address,
            posted_by: JSON.parse(user).id,
            before_image_url: 'formData.beforeImage'
        }};

        await TaskerApi.createJob(jobInfo);

        setFormData(INITIAL_STATE);
        setVisible(false);
    };


    return (
        <div className="createJob-container" data-testid="createJob-form-container">
            {visible && (
            <div>
                {/* form for registering */}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Job Title: </label>
                    <input 
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Job Title"
                        data-testid="createJob-form-title-input"
                        value={FormData.title}
                        onChange={handleChange}
                    />
                    <label htmlFor="body">Job Description: </label>
                    <textarea rows="6" cols="40"
                        id="body"
                        name="body"
                        placeholder="Briefly describe the job..."
                        data-testid="createJob-form-body-input"
                        value={FormData.body}
                        onChange={handleChange}
                    />
                    <label htmlFor="address">Address: </label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        placeholder="Adress"
                        data-testid="createJob-form-address-input"
                        value={FormData.address}
                        onChange={handleChange}
                    />
                    {/* <label htmlFor="beforeImage">Image: </label>
                    <input
                        id="beforeImage"
                        type="password"
                        name="password"
                        placeholder=""
                        data-testid="signup-form-password-input"
                        value={FormData.password}
                        onChange={handleChange}
                    /> */}
                    <button type="submit" data-testid="createJob-form-button">Post Job</button>
                </form>
            </div>
            )}
        </div>
    )
}

export default CreateJob;