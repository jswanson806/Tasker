import React, { useState, useContext } from "react";
import { TokenContext } from '../helpers/TokenContext.js';
import { useNavigate } from "react-router-dom";
import TaskerApi from "../api.js";
import { UserContext } from "../helpers/UserContext.js";
import {Button, CardBody, Form, FormText, Card, CardTitle} from "reactstrap";
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
            password: formData.password,
        }

        try {
            
            const res = await TaskerApi.login(userInfo.email, userInfo.password);
            const { token, user } = res;
            const newUser = JSON.stringify({id: user.id, email: user.email, isWorker: user.isWorker});
            
            // update localStorage token and user
            updateToken(token);
            updateUser(newUser);

            // clear the form data
            setFormData(INITIAL_STATE);
            // redirect to dashboard
            navigate("/dashboard");
        } catch(err) {
            return err;
        }
    }


    return (
        <div className="login-container">
            
                <div className="login-centered-card">
                    
                    <h5>Login</h5>

                    <Form onSubmit={handleSubmit}>
                        <FormText htmlFor="email">Email</FormText>
                        <input
                            id="email"
                            type="text"
                            name="email"
                            placeholder="Email Address"
                            data-testid="login-form-email-input"
                            value={FormData.email}
                            onChange={handleChange}
                        />
                        <FormText htmlFor="password">Password</FormText>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="********"
                            data-testid="login-form-password-input"
                            value={FormData.password}
                            onChange={handleChange}
                        />
                        <Button className="login-button" type="submit" color="info" data-testid="login-form-button">Login</Button>
                    </Form>
                    
                </div>

        </div>
    );
}

export default Login;