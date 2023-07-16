import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskerApi from "../api";


/**
 * SignUp component for user registration.
 *
 * This component renders a sign-up form where users can enter their email, first name,
 * last name, phone number, and password to register for an account. Upon successful
 * registration, the user is logged in, and their token is stored in the local storage
 * for further authentication. The user is then redirected to the dashboard.
 *
 * @returns {JSX.Element} The rendered sign-up form component.
 */


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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userInfo = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            password: formData.password,
        }
        
        // register call to api
        const registerToken = await TaskerApi.registerUser(userInfo);
        // check for registerToken to be true
        if(registerToken) {
            // login call to api
            const loginToken = await TaskerApi.login(userInfo.email, userInfo.password);
            // set token in local storage for further authentication
            localStorage.setItem('userToken', loginToken)
        }
        
        // clear the form data
        setFormData(INITIAL_STATE);
        // redirect to dashboard
        navigate("/dashboard");
    }



    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email"
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        data-testid="signup-form-email-input"
                        value={FormData.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        data-testid="signup-form-first-name-input"
                        value={FormData.firstName}
                        onChange={handleChange}
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        data-testid="signup-form-last-name-input"
                        value={FormData.lastName}
                        onChange={handleChange}
                    />
                    <label htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        data-testid="signup-form-phone-input"
                        value={FormData.phone}
                        onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder=""
                        data-testid="signup-form-password-input"
                        value={FormData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" data-testid="signup-form-button">Signup</button>
                </form>
                
            </div>
        </div>
    );
}

export default SignUp;