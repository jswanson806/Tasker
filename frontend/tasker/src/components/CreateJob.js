import React, { useState, useContext, useRef } from "react";
import { UserContext } from "../helpers/UserContext";
import TaskerApi from "../api";
import { Button, Input, Form, FormGroup, Label, FormText, FormFeedback, Modal, ModalBody, ModalHeader} from "reactstrap";
import "./styles/CreateJob.css";

const CreateJob = ({onCreate, onClose, isOpen}) => {

    const INITIAL_STATE = {
        title: '',
        body: '',
        address: '',
        postedBy: '',
        before_image_url: '',
    }

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [isValid, setIsValid] = useState(true);
    const [imageFile, setImageFile] = useState('');

    const { user } = useContext(UserContext);

    const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))

        if(name === "body") {
            adjustTextareaHeight(e.target);
            adjustAreaHeight();
        }
    };

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto'; // Reset the height to auto
        textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to the scrollHeight
      };

    const adjustAreaHeight = () => {

        const cardContent = document.querySelector('.createJob-centered-card');
        const textarea = document.querySelector('#body');  

        if (cardContent && textarea) {
          cardContent.style.maxHeight = `${textarea.scrollHeight + 600}px`;
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const jobInfo = {
                job: {
                    title: formData.title,
                    body: formData.body,
                    address: formData.address,
                    posted_by: JSON.parse(user).id,
                    before_image_url: imageFile.name,
                }
            };
            
            const form = new FormData();
            form.append('image', imageFile);

            await TaskerApi.createJob(jobInfo);
            await TaskerApi.uploadBeforeImage(form, JSON.parse(user).id,);

            setFormData(INITIAL_STATE);
            onCreate();
        } catch (error) {
            console.error('Error:', error);
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

    return (
      <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
        <div className="modal-content">
          
          <h2>Create a New Job</h2>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                  <Label for="title">Job Title:</Label>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Job Title"
                    data-testid="createJob-form-title-input"
                    value={FormData.title}
                    onChange={handleChange}
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="body">Job Description:</Label>
                  <Input
                    type="textarea"
                    id="body"
                    name="body"
                    placeholder="Briefly describe the job..."
                    data-testid="createJob-form-body-input"
                    value={FormData.body}
                    onChange={handleChange}
                    rows={1}
                    style={{resize: 'none', overflowY: 'hidden'}}
                  />
              </FormGroup>
              <FormGroup>
                  <Label for="address">Address:</Label>
                  <Input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Address"
                    data-testid="createJob-form-address-input"
                    value={FormData.address}
                    onChange={handleChange}
                  />
                <FormFeedback>Please enter an address.</FormFeedback>
              </FormGroup>
              <FormGroup>
                  <Label for="imageInput">
                      Upload "Before" Image
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
              <div className="button-container">
              <Button className="button" color="info" type="submit" data-testid="createJob-submit-button">Post Job</Button>
              <Button className="button" color="danger" type="submit" data-testid="createJob-close-button" onClick={onClose}>Close</Button>
              </div>
            </Form>
          </div>
        </div>
    );
  }

export default CreateJob;