import React, { useState, useContext } from "react";
import { TokenContext } from '../helpers/TokenContext.js';
import { useNavigate } from "react-router-dom";
import TaskerApi from "../api.js";
import { UserContext } from "../helpers/UserContext.js";
import {Button, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import "./styles/Login.css";


/**
 * Login component for user authentication.
 *
 * This component renders a login form where users can enter their email and password
 * to authenticate themselves. The user is then redirected to the
 * dashboard.
 *
 * @returns {JSX.Element} The rendered login form component.
 */

const Login = () => {

    const navigate = useNavigate();

    const { updateToken } = useContext(TokenContext);
    const { updateUser } = useContext(UserContext);

    const INITIAL_STATE = {
        email: '',
        password: '',
    }

    const [formData, setFormData] = useState(INITIAL_STATE);

    /** handles events on the form to update as the user types */
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))
    }
    /** handles submission of the form 
     * 
     * Calls api to log user in
     * Updates token and user context state
     * 
     * resets the form data
     * 
     * redirects user to jobs page
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userInfo = {
            email: formData.email,
            password: formData.password,
        }

        try {
            // call api to login user
            const res = await TaskerApi.login(userInfo.email, userInfo.password);
            // destructure token and user objects from response
            const { token, user } = res;
            // create stringified user object to store in local storage
            const newUser = JSON.stringify({id: user.id, email: user.email, isWorker: user.isWorker});
            
            // update localStorage token and user
            updateToken(token);
            updateUser(newUser);

            // clear the form data
            setFormData(INITIAL_STATE);
            // redirect to jobs
            navigate("/jobs");
        } catch(err) {
            return err;
        }
    }


    return (
        <div className="login-container">
            <div className="login-message-container">
                <p>Welcome Back to Tasker!</p>
            </div>
            
            <div className="login-form-container">
            
                <div className="login-header">
                    <h3>Login</h3>
                </div>
                
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        data-testid="login-form-email-input"
                        value={FormData.email}
                        onChange={handleChange}
                    />
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="********"
                        data-testid="login-form-password-input"
                        value={FormData.password}
                        onChange={handleChange}
                    />
                    </FormGroup>
                    <div className="login-button-container">
                        <Button className="login-button" type="submit" color="info" data-testid="login-form-button">Login</Button>
                    </div>
                    <div className="login-signup-message-container">
                        <p>Not yet registered?</p>
                        <a href="/signup">Sign Up</a>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Login;