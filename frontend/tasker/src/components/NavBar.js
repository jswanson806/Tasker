import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem } from 'reactstrap';
import { TokenContext } from "../helpers/TokenContext";
import './styles/NavBar.css';


const NavBar = () => {

    const navigate = useNavigate();

    const { token, updateToken } = useContext(TokenContext);

    let loggedIn = (token && token !== '') ? true : false;

    /** Removes token and user from localStorage */
    const logOut = () => {
        updateToken('');
        navigate("/login");
    }


    return(
        <Navbar expand="md" className="Navbar" data-testid="Navbar">

            {!loggedIn ? (
                <NavLink to="/" className="Navlink" data-testid="Navbar-dashboard">
                    Tasker
                </NavLink>
            ) : (
                <NavLink to="/dashboard" className="Navlink" data-testid="Navbar-dashboard">
                    Dashboard
                </NavLink>
            )}

            <Nav className="Navbar-nav">
                
                {/* Conditionally render user navigation links based on loggedIn status */}
                {!loggedIn ? (
                    <>
                        <NavItem>
                            <NavLink to="/login" className="Navlink"        data-testid="Navbar-login">
                                Login
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/signup" className="Navlink"      data-testid="Navbar-signup">
                                Sign Up
                            </NavLink>
                        </NavItem>
                    </>
                ) : (
                    <>
                    <NavItem>
                        <NavLink to="/jobs" className="Navlink" data-testid="Navbar-jobs">
                            Jobs
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/messages" className="Navlink" data-testid="Navbar-messages">
                            Messages
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/reviews" className="Navlink" data-testid="Navbar-reviews"> 
                            Reviews
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/account" className="Navlink" data-testid="Navbar-account">
                            Account
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <button onClick={logOut} className="Navlink-button"   data-testid="Navbar-logout-button">Logout</button>
                    </NavItem>
                    </>
                )}

            </Nav>

        </Navbar>
    )
};

export default NavBar;