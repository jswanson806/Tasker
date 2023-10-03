import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem, NavbarBrand, NavbarToggler, Collapse, Button } from 'reactstrap';
import { TokenContext } from "../helpers/TokenContext";
import { UserContext } from "../helpers/UserContext";
import "./styles/NavBar.css";


const NavBar = () => {

    const navigate = useNavigate();

    const { token, updateToken } = useContext(TokenContext);
    const { updateUser } = useContext(UserContext);
    const [collapsed, setCollapsed] = useState(true);

    let loggedIn = (token && token !== '') ? true : false;

    const toggleNavbar = () => setCollapsed(!collapsed);

    /** Removes token and user from localStorage 
     * 
     * Redirects to /login
    */
    const logOut = () => {
        updateToken('');
        updateUser('');
        navigate("/login");
    }

    return(
        <div>
        <Navbar container="xl" expand="md" color="dark" dark data-testid="Navbar" >
            {!loggedIn ? (
                <NavLink to="/" className="me-auto" >
                    <Button color="info" outline data-testid="Navbar-tasker">Tasker</Button>
                </NavLink>
            ) : (
                <NavLink to="/jobs" >
                    <Button color="info" outline data-testid="Navbar-dashboard">Tasker</Button>
                </NavLink>
            )}

            <NavbarToggler onClick={toggleNavbar} className="me-2"/>
            <Collapse isOpen={!collapsed} navbar>
                <Nav navbar className="ml-auto">

                    {/* Conditionally render user navigation links based on loggedIn status */}
                    {!loggedIn ? (
                        <>
                            <NavItem className="mr-2">
                                <NavLink to="/login" >
                                    <Button color="warning" outline data-testid="Navbar-login">Login</Button>
                                </NavLink>
                            </NavItem>
                            <NavItem className="mr-2">
                                <NavLink to="/signup" >
                                    <Button color="info" outline data-testid="Navbar-signup">Sign Up</Button>
                                </NavLink>
                            </NavItem>
                        </>
                    ) : (
                        <>
                            <NavItem className="mr-2">
                                <NavLink to="/jobs" >
                                    <Button color="info" outline data-testid="Navbar-jobs">Jobs</Button>
                                </NavLink>
                            </NavItem>
                            <NavItem className="mr-2">
                                <NavLink to="/messages">
                                    <Button color="info" outline data-testid="Navbar-messages">Messages</Button>
                                </NavLink>
                            </NavItem>
                            <NavItem className="mr-2">
                                <Button onClick={logOut} data-testid="Navbar-logout-button" color="danger" outline>Logout</Button>
                            </NavItem>
                        </>
                    )}

                </Nav>
            </Collapse>

        </Navbar>
        </div>
    )
};

export default NavBar;