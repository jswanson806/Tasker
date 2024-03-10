import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../helpers/TokenContext";
import { UserContext } from "../helpers/UserContext";
import TaskerApi from "../api";
import {Form, Input, Label, FormGroup, Button} from "reactstrap";
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
    const [errors, setErrors] = useState({});

    const { token, updateToken } = useContext(TokenContext);
    const { user, updateUser } = useContext(UserContext);
    

    useEffect(() => {
        if(user !== ''){
            // redirect to default route
            navigate("/");
        }
    }, [user])

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
            // e.target.value = formattedValue;

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

        // handle form field errors
        const errors = {};
        // validate email field
        if(!formData.email){
            errors.email = "Email address is required."
        } else if(!formData.email.match(/\S+@\S+\.\S+/)) {
            errors.email = "A valid email address is required."
        }
        // validate firstName field
        if(!formData.firstName){
            errors.firstName = "First name is required."
        }
        // validate lastName field
        if(!formData.lastName){
            errors.lastName = "Last name is required."
        }
        // validate phone number field
        if(!formData.phone){
            errors.phone = "Phone number is required."
        } else if(formData.phone.length < 10){
            errors.phone = "Phone number must be at least 10 numbers long"
        }
        // validate password field
        if(!formData.password){
            errors.password = "Password is required."
        }
        // Check for at least 8 characters in password
        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }
    
        // Check for at least 1 number in password
        if (!/\d/.test(formData.password)) {
            errors.password = 'Password must contain at least one number';
        }
    
        // Check for at least 1 uppercase letter in password
        if (!/[A-Z]/.test(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter';
        }
    
        // Check for at least 1 special character in password
        if (!/[^A-Za-z0-9]/.test(formData.password)) {
            errors.password = 'Password must contain at least one special character';
        }

        setErrors(errors);

        if(Object.keys(errors).length === 0){
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
                    const newUser = JSON.stringify({id: user.id, isWorker: user.isWorker});
                    // set token and user in local storage for further auth
                    updateToken(token);
                    updateUser(newUser);
                }

                // clear the form data
                setFormData(INITIAL_STATE);

            } catch(err) {
                errors.api = err[0];
                setErrors(errors);
                return err;
            }
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-message-container">

                {/* render title depending on state of isWorker */}
                <p className="signup-message-header">Welcome to Tasker!</p>
                <p className="signup-message-details">
                    Post Jobs as a {<span style={{color: "#14A2B8"}}>User</span>}<br></br> Find Jobs as a {<span style={{color: "#FFC008"}}>Worker</span>}
                </p>
            </div>

            <div className="signup-form-container">
                <div className="signup-header">
                    <h3>Sign Up</h3>
                </div>
                {/* render button to toggle between user and worker signup */}
                    <div className="signup-type-button-container">
                      <Button type="radio" color="warning" onClick={() => setIsWorker(true)}>
                        Worker
                      </Button>
                      <Button color="info" onClick={() => setIsWorker(false)}>
                        User
                      </Button>
                    </div>
                
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
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors && errors.email && <span className="text-danger">{errors.email}</span>}
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        data-testid="signup-form-first-name-input"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors && errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        data-testid="signup-form-last-name-input"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors && errors.lastName && <span className="text-danger">{errors.lastName}</span>}
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        data-testid="signup-form-phone-input"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors && errors.phone && <span className="text-danger">{errors.phone}</span>}
                    </FormGroup>
                    <FormGroup> 
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="********"
                        data-testid="signup-form-password-input"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors && errors.password && <span className="text-danger">{errors.password}</span>}
                    </FormGroup>
                    <div className="signup-button-container">
                        <Button className="signup-button" color="info" type="submit" data-testid="signup-form-button">Signup</Button>
                        {errors && errors.api && <span className="text-danger">{errors.api}</span>}
                    </div>
                    <div className="login-signup-message-container">
                        <p>Already registered?</p>
                        <a href="/login">Login</a>
                    </div>
                </Form>
                
            </div>
        </div>
    );
}

export default SignUp;