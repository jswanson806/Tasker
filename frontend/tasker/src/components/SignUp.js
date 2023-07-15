import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const userInfo = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            password: formData.password,
        }
        
        // register user call goes here

        setFormData(INITIAL_STATE);
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
                        value={FormData.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={FormData.firstName}
                        onChange={handleChange}
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={FormData.lastName}
                        onChange={handleChange}
                    />
                    <label htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={FormData.phone}
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

export default SignUp;