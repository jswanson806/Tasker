import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../helpers/TokenContext";
import { UserContext } from "../helpers/UserContext";
import TaskerApi from "../api";


/**
 * SignUp component for user registration.
 *
 * This component renders a sign-up form where users can enter their email, first name,
 * last name, phone number, and password to register for an account. Users can select either 'user' or 'worker' as the registration type.
 * Upon successful registration, the user is logged in, and their token is stored in the local storage
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
    const [ isWorker, setIsWorker ] = useState(false);
    const { token, updateToken } = useContext(TokenContext);
    const { user, updateUser } = useContext(UserContext);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                const { token, user } = res;
                const newUser = JSON.stringify({id: user.id, email: user.email, isWorker: user.isWorker});
                // set token in local storage for further auth
                updateToken(token);
                updateUser(newUser);
            }

            // clear the form data
            setFormData(INITIAL_STATE);
            // redirect to dashboard
            navigate("/dashboard");

        } catch(err) {
            return err;
        }
        
    }

    // toggles state of isWorker boolean
    const toggleIsWorker = () => {
        setIsWorker(!isWorker);
    }

    return (
        <div className="signup-container">
            <div className="signup-card">

                {/* render title depending on state of isWorker */}
                <h1>{!isWorker ? 'Sign Up to Post Jobs' : 'Sign Up to Find Jobs'}</h1>

                {/* render button to toggle between user and worker signup */}
                {isWorker && (
                    <button data-testid="signup-form-toggle" onClick={toggleIsWorker}>Worker</button>
                )}

                {!isWorker && (
                    <button data-testid="signup-form-toggle" onClick={toggleIsWorker}>User</button>
                )}
                
                {/* form for registering */}
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