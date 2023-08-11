import React, { useState, useContext } from "react";
import { UserContext } from "../helpers/UserContext";
import TaskerApi from "../api";

const CreateReview = ({toggleCreateReview}) => {
    const INITIAL_STATE = {
        title: '',
        body: '',
        stars: 3,
        reviewed_by: '',
        reviewed_for: '',
    };

    const [formData, setFormData] = useState(INITIAL_STATE);
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

        let reviewInfo = {review: {
            title: formData.title,
            body: formData.body,
            stars: formData.stars,
            reviewed_by: JSON.parse(user).id,
            reviewed_for: ''
        }};

        await TaskerApi.createReview(reviewInfo);

        toggleCreateReview();
    };


    return (
        <div className="createReview-container" data-testid="createReview-form-container">
                {/* form for registering */}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title: </label>
                    <input 
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Job Title"
                        data-testid="createReview-form-title-input"
                        value={FormData.title}
                        onChange={handleChange}
                    />
                    <label htmlFor="body">Body: </label>
                    <textarea rows="6" cols="40"
                        id="body"
                        name="body"
                        maxLength="200"
                        placeholder="Write your review in 200 characters..."
                        data-testid="createReview-form-body-input"
                        value={FormData.body}
                        onChange={handleChange}
                    />
                    <label htmlFor="address">Stars: </label>
                    <input
                        id="stars"
                        type="range"
                        name="stars"
                        value={FormData.stars}
                        min="1"
                        max="5"
                        step="0.5"
                        data-testid="createReview-form-stars-input"
                        onChange={handleChange}
                    />
                    <button type="submit" data-testid="createReview-form-button">Submit Review</button>
                </form>
        </div>
    )
}

export default CreateReview;