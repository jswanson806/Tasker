import React, { useState } from "react";
import TaskerApi from "../api";
import { Button, Input, Form, FormGroup, Label, FormFeedback, FormText } from "reactstrap";
import "./styles/JobCompletionForm.css";

const JobCompletionForm = ({job, onUpload}) => {    

    const [imageFile, setImageFile] = useState('');
    const [isValid, setIsValid] = useState(true);
    
    const rate = 20.00;
    const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try{
            const updateInfo = createJobUpdate();
            // create job update object and spread job
            const jobInfo = { job: {...updateInfo}};
            console.log(jobInfo)
           
            const form = new FormData();
            form.append('image', imageFile);
            
            // update job in db
            await TaskerApi.updateSingleJob(jobInfo);
            // call api to upload file to S3 storage
            await TaskerApi.uploadAfterImage(form, job.assigned_to);
            onUpload();
        } catch(err) {
            console.error('Error:', err);
        }
        
    };


    const handleUpload = async (e) => {
    
        const file = e.target.files[0];

        if(!validFileTypes.find(type => type === file.type)){
            setIsValid(false);
            return;
        };

        setIsValid(true);

        setImageFile(file);

    };

    /** Updates job with values for after_image_url, end_time, and payment_due
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

        // set the after_image_url property to the value of image from form
        job.after_image_url = imageFile.name;

        // set the end_time property to current time/date
        job.end_time = currentTime.toLocaleString(undefined, options);

        const hours = calculateHoursWorked(job);

        job.payment_due = calculatePaymentDue(hours, rate);

        job.status = 'pending review';
 
        return job;
    }

    /** Calculate the time spent working on the job in hours
     * 
     * Returns hours worked
     */
    const calculateHoursWorked = (job) => {

        const startDate = new Date(job.start_time);
        const endDate = new Date(job.end_time);

        // Calculate the time difference in milliseconds
        const timeDifferenceMs = endDate - startDate;

        // Calculate the time difference in hours
        const hoursWorked = timeDifferenceMs / (1000 * 60 * 60);

        return hoursWorked;
    }

    /** Calculate the payment due for the job
     * 
     * Returns payment due rounded to 4 decimal places
     */

    const calculatePaymentDue = (hours, rate) => {

        // calculate payment due based on hours worked
        const value = hours * rate;
        console.log(value);
        const paymentDue = Number(value);

        return paymentDue;
    }


    /**********************************NEEDS TO BE INTEGRATED ************************************* */


    return (
        <div className="jobCompletion-form-container">
            <div className="jobCompletion-centered-card">
                {/* form for completing job */}
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
                            onChange={handleUpload}
                            valid={isValid}
                            invalid={!isValid}
                        />

                        {!isValid 
                            ? 
                            <FormFeedback >Invalid file type</FormFeedback> 
                            : 
                            <FormFeedback valid>Valid file type</FormFeedback>
                        }
                        <FormText>Supported File Types: jpg, png</FormText>
                    </FormGroup>
                    <Button type="submit" data-testid="jobCompletion-form-button">Upload</Button>
                </Form>
            </div>
        </div>
    )
}

export default JobCompletionForm;