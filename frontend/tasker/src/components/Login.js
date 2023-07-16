import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskerApi from "../api";

/**
 * Login component for user authentication.
 *
 * This component renders a login form where users can enter their email and password
 * to authenticate themselves. Upon successful login, the user's token is stored in
 * the local storage for further authentication. The user is then redirected to the
 * dashboard.
 *
 * @returns {JSX.Element} The rendered login form component.
 */

const Login = () => {

    
    const navigate = useNavigate();

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

        const res = await TaskerApi.getAllJobs();
        console.log(res)

        // // call api to login the user
        // const token = await TaskerApi.login(userInfo.email, userInfo.password);
        // // set the returned token in localStorage for further authentication
        // localStorage.setItem('userToken', token)

        // clear the form data
        setFormData(INITIAL_STATE);
        // redirect to dashboard
        navigate("/dashboard");
    }


    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        data-testid="login-form-email-input"
                        value={FormData.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder=""
                        data-testid="login-form-password-input"
                        value={FormData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" data-testid="login-form-button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;