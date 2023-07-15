import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const userInfo = {
            email: formData.email,
            password: formData.password,
        }

        // login user call goes here
        
        setFormData(INITIAL_STATE);
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
                        value={FormData.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder=""
                        value={FormData.password}
                        onChange={handleChange}
                    />
                </form>
            </div>
        </div>
    );
}

export default Login;