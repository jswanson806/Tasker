import React from 'react';
import { NavLink } from "react-router-dom";
import {Button, NavItem, Nav} from 'reactstrap';
import "./styles/Welcome.css";



const Welcome = () => {


    return(
        <div className="welcome-card-container">
            <div className="welcome-centered-card">

            <h1>Welcome to Tasker!</h1>

                <h4>Tasker is your personal marketplace for finding help to get things done.</h4>
                <h6>Sign up as a 'User' to post your open jobs or as a 'Worker' to get hired today!</h6>
                
                <div className="welcome-buttons-container">
                    <h6>New here?</h6>
                    <Nav className="ml-auto">
                        <NavItem className="mr-2">
                            <NavLink to="/signup" className="me-auto">
                                <Button color="info" data-testid="welcome-signup-button">
                                    Sign Up
                                </Button>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <h6>Already registered?</h6>
                    <Nav className="ml-auto">
                        <NavItem className="mr-2" >
                            <NavLink to="/login" className="me-auto">
                                <Button color="warning" className="welcome-login-button" data-testid="welcome-login-button">
                                    Login
                                </Button>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
            </div>
        </div>
    );
}

export default Welcome;