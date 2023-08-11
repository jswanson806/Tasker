import React, { useEffect, useState, useRef } from "react";
import TaskerApi from "../api";

const JobCompletionForm = ({job}) => {

    const INITIAL_STATE = {
        after_image : ''
    };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [currJob, setCurrJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const imageInputRef = useRef(null);

    useEffect(() => {
        setCurrJob(job);
    }, []);


    useEffect(() => {
        if(currJob) {
            setIsLoading(false);
        }
    }, [currJob])


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedFile = imageInputRef.current.files[0];

        if(selectedFile) {
            try{
                let jobInfo = {job: {
                    ...currJob,
                    after_image: formData.afterImage
                }}
                await TaskerApi.updateSingleJob(jobInfo)
                await uploadFile(selectedFile)
            } catch(err) {
               console.error("Error: ", err)
            }
        };
    };

    const uploadFile = async (file) => {
        // STORAGE API CALL GOES HERE

        
    };


    if(isLoading) {
        return <div>Loading...</div>
    }


    return (
        <div>
            {/* form for completing job */}
            <form onSubmit={handleSubmit}>
                    <label htmlFor="afterImage">Submit An Image of Completed Work:</label>
                    <input
                        id="afterImage"
                        ref={imageInputRef}
                        type="file"
                        name="afterImage"
                        data-testid="jobCompletion-form-image-input"
                        value={FormData.afterImage}
                        onChange={handleChange}
                    />
                    <button type="submit" data-testid="jobCompletion-form-button">Upload</button>
                </form>
        </div>
    )
}

export default JobCompletionForm;