import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../helpers/TokenContext";
import { UserContext } from "../helpers/UserContext";
import TaskerApi from "../api";
import {Form, Input, Label, FormGroup, Button, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import "./styles/SignUp.css";


const SignUp = () => {

    const navigate = useNavigate();

    
    const INITIAL_STATE = {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
    }

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [ isWorker, setIsWorker ] = useState(false);
    const { token, updateToken } = useContext(TokenContext);
    const { user, updateUser } = useContext(UserContext);

    /** Dynamically formats phone number input to match expected format in db
     * 
     * accepts a value inserts hyphens 
     */
    function formatPhoneNumber(value) {
        let match = value.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        
        if (!match) return value;
    
        return match[1] + (match[1] && match[2] ? '-' : '') + match[2] + (match[3] ? '-' : '') + match[3];
      }

    /** Dynamically updates form fields as user types
     * 
     * Removes non-digit characters from phone number input and calls helper function to format correctly
     * 
     * updates the formData state as user types
     */
    const handleChange = (e) => {
        const {name, value} = e.target;

        // conditionally format field for phone number or else just update the field
        if(name === "phone"){
            let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
            let formattedValue = formatPhoneNumber(inputValue);
            
            // update field with formatted value as user types
            e.target.value = formattedValue;

            setFormData(formData => ({
                ...formData,
                [name]: formattedValue
            }))

        } else {

            setFormData(formData => ({
                ...formData,
                [name]: value
            }))
        }
    }
    /** Handles submission of the form
     * 
     * Creates user object and updates isWorker property depending on which type of registration is being submitted
     * 
     * Calls api to register user and to log in the user upon successful registration
     * 
     * updates the token and user contexts with new user info
     * 
     * resets the form data and navigates to the jobs page
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        // construct user object
        let userInfo = {user: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            password: formData.password,
            isWorker: false,
        }};

        // set isWorker property on userInfo object based on state of isWorker
        if(isWorker){
            userInfo.user.isWorker = true;
        }

        try {
            // register call to api
            const registerToken = await TaskerApi.registerUser(userInfo);
        
            // check for registerToken to be true
            if(registerToken) {
                // login call to api
                const res = await TaskerApi.login(userInfo.user.email, userInfo.user.password);
                // destructure user and token from api response
                const { token, user } = res;
                // stringify the user info for localStorage
                const newUser = JSON.stringify({id: user.id, email: user.email, isWorker: user.isWorker});
                // set token and user in local storage for further auth
                updateToken(token);
                updateUser(newUser);
            }

            // clear the form data
            setFormData(INITIAL_STATE);
            // redirect to dashboard
            navigate("/jobs");

        } catch(err) {
            return err;
        }
        
    }

    return (
        <div className="signup-container">
            <div className="signup-centered-card">

                {/* render title depending on state of isWorker */}
                <h5>{!isWorker ? 'Sign Up to Post Jobs' : 'Sign Up to Find Jobs'}</h5>

                {/* render button to toggle between user and worker signup */}
                <ButtonGroup className="my-2">
                  <UncontrolledDropdown>
                    <DropdownToggle caret>
                      {isWorker ? <>Worker</> : <>User</>}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setIsWorker(true)}>
                        Worker
                      </DropdownItem>
                      <DropdownItem onClick={() => setIsWorker(false)}>
                        User
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </ButtonGroup>
                
                {/* form for registering */}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email"
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        data-testid="signup-form-email-input"
                        value={FormData.email}
                        onChange={handleChange}
                    />
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        data-testid="signup-form-first-name-input"
                        value={FormData.firstName}
                        onChange={handleChange}
                    />
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        data-testid="signup-form-last-name-input"
                        value={FormData.lastName}
                        onChange={handleChange}
                    />
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        data-testid="signup-form-phone-input"
                        value={FormData.phone}
                        onChange={handleChange}
                    />
                    </FormGroup>
                    <FormGroup> 
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder=""
                        data-testid="signup-form-password-input"
                        value={FormData.password}
                        onChange={handleChange}
                    />
                    </FormGroup>
                    <Button className="signup-button" color="info" type="submit" data-testid="signup-form-button">Signup</Button>
                </Form>
                
            </div>
        </div>
    );
}

export default SignUp;