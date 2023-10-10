import React, { useState } from "react";
import TaskerApi from "../api";
import { Button, Input, Form, FormGroup, Label, FormFeedback, FormText } from "reactstrap";
import "./styles/JobCompletionForm.css";

const JobCompletionForm = ({job, onUpload}) => {    

    const [imageFile, setImageFile] = useState('');
    const [isValid, setIsValid] = useState(true);
    
    // default rate for Tasker -> (once reviews are implemented, workers should have variable rates depending on ratings)
    const rate = 20.00;
    // array of valid file types for uploading an image
    const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    /** Handles form submission
     * 
     * Creates job update data and appends imageFile to the form
     * 
     * calls API to update job and upload after image to AWS S3
     * 
     * Calls onUpload function recieved from JobCard component
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try{
            const updateInfo = createJobUpdate();
            // create job update object and spread job
            const jobInfo = { job: {...updateInfo}};
           
            // initilize new FormData object and append image/imageFile key/value pair
            const form = new FormData();
            form.append('image', imageFile);
            
            // update job in db
            await TaskerApi.updateSingleJob(jobInfo);
            // call api to upload file to S3 storage
            await TaskerApi.uploadAfterImage(form, job.assigned_to);
            // call onUpload function from JobCard component, which calls endWork to hide the form and trigger rerender
            onUpload();
        } catch(err) {
            console.error('Error:', err);
        }
        
    };

    /** Handles file upload
     * 
     * Varifies file type is valid
     * 
     * Updates state of isValid and imageFile
     */
    const handleUpload = async (e) => {
        // get the target file
        const file = e.target.files[0];
        // if filetype not in array of valid files, update state and return
        if(!validFileTypes.find(type => type === file.type)){
            setIsValid(false);
            return;
        };
        // update state of isValid
        setIsValid(true);
        // update state of imageFile
        setImageFile(file);

    };

    /** Creates the job update data object
     * 
     * Updates job properties with values for after_image_url, end_time, payment_due, and status
     * 
     * Calls caluclatedHoursWorked and calculatePaymentDue
     * 
     * returns job object
     */

    const createJobUpdate = () => {

        // set options for toLocalString method of the Date object
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric'
        }
        // initialize new Date object
        const currentTime = new Date();
        // variable will hold calculated hours worked
        let hours;

        // update the end_time property to current time/date
        job.end_time = currentTime.toLocaleString(undefined, options);
        // with end_time set, calculate hours worked
        hours = calculateHoursWorked(job);
        // with calculated hours, calculate payment due
        job.payment_due = calculatePaymentDue(hours, rate);
        // update the after_image_url property to the value of image form field
        job.after_image_url = imageFile.name;
        // update job status
        job.status = 'pending review';
 
        return job;
    }

    /** Calculate the time spent working on the job in hours
     * 
     * Returns hours worked
     */
    const calculateHoursWorked = (job) => {
        // initialize new Date objects for start and end times
        const startDate = new Date(job.start_time);
        const endDate = new Date(job.end_time);

        // Calculate the time difference in milliseconds
        const timeDifferenceMs = endDate - startDate;

        // Calculate the time difference in hours
        const hoursWorked = timeDifferenceMs / (1000 * 60 * 60);

        // return time in hours
        return hoursWorked;
    }

    /** Calculate the payment due for the job in cents (smallest currency unit for Stripe API)
     * 
     * Returns payment due as integer
     */

    const calculatePaymentDue = (hours, rate) => {
        // calculate payment due in cents based on hours worked
        const paymentInCents = Math.round(hours * rate * 100);
        //return payment due in cents
        return paymentInCents;
    }


    return (
        <div className="jobCompletion-form-container">
            <div className="jobCompletion-centered-card">
                {/* form for completing job - calls handleUpload and handleSubmit*/}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Input
                        id="imageInput"
                        type="file"
                        name="image"
                        hidden
                        onChange={handleUpload}
                    />
                    </FormGroup>
                    <FormGroup>
                        <Label for="imageInput">
                            Upload "After" Image
                        </Label>
                        <Input
                            id="imageInput"
                            type="file"
                            name="image"
                            data-testid="image-input"
                            onChange={handleUpload}
                            valid={isValid}
                            invalid={!isValid}
                        />
                        {/* provide form feedback for iamge upload based on isValid state */}
                        {!isValid 
                            ? 
                            <FormFeedback >Invalid file type</FormFeedback> 
                            : 
                            <FormFeedback valid>Valid file type</FormFeedback>
                        }
                        <FormText>Supported File Types: jpg, png</FormText>
                    </FormGroup>
                    <Button type="submit" data-testid="jobCompletion-submit-button">Upload</Button>
                </Form>
            </div>
        </div>
    )
}

export default JobCompletionForm;