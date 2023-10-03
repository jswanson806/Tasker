import React from "react";
import { render, act, waitFor, screen, fireEvent, queryByTestId} from '@testing-library/react';
import NavBar from "../NavBar.js";
import App from "../App.js";
import "reactstrap";
import { TokenContext } from "../../helpers/TokenContext.js";
import TaskerApi from "../../api.js";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../../helpers/UserContext.js";


describe('smoke and snapshot tests', () => {

    test('renders without crashing', async () => {
        render(
            <MemoryRouter >
                <UserContext.Provider value={UserContext} >
                <TokenContext.Provider value={TokenContext}>
                    <NavBar />
                </TokenContext.Provider >
                </UserContext.Provider>
            </MemoryRouter>
        )
    });


    test('matches snapshot', async () => {
        const {asFragment} = render(
            <MemoryRouter >
                <UserContext.Provider value={UserContext} >
                <TokenContext.Provider value={TokenContext}>
                    <NavBar />
                </TokenContext.Provider >
                </UserContext.Provider>
            </MemoryRouter>
        )

        expect(asFragment()).toMatchSnapshot();
    });
});


describe('renders correct content', () => {
    test('works - not logged in', async () => {

        expect.assertions(6);

        render(
            <MemoryRouter >
                <UserContext.Provider value={UserContext} >
                <TokenContext.Provider value={''}> 
                    <NavBar />
                </TokenContext.Provider >
                </UserContext.Provider>
            </MemoryRouter>
        );

        const taskerLink = screen.queryByTestId("Navbar-tasker");
        const logoutBtn = screen.queryByTestId("Navbar-logout-button");
        const jobsLink = screen.queryByTestId("Navbar-jobs");
        const messagesLink = screen.queryByTestId("Navbar-messages");
        const loginLink = screen.queryByTestId("Navbar-login");
        const signupLink = screen.queryByTestId("Navbar-signup");

        // token context set to empty string results in 'Tasker' button render
        expect(taskerLink).toBeInTheDocument();
        expect(loginLink).toBeInTheDocument();
        expect(signupLink).toBeInTheDocument();
        expect(jobsLink).not.toBeInTheDocument();
        expect(messagesLink).not.toBeInTheDocument();

        // should render logOut button
        expect(logoutBtn).not.toBeInTheDocument();
    });

    test('works - logged in', async () => {

        expect.assertions(6);

        render(
            <MemoryRouter >
                <UserContext.Provider value={UserContext} >
                <TokenContext.Provider value={{ token: 'test-token', updateToken: () => {} }}> 
                    <NavBar />
                </TokenContext.Provider >
                </UserContext.Provider>
            </MemoryRouter>
        );

        const taskerLink = screen.queryByTestId("Navbar-tasker");
        const logoutBtn = screen.queryByTestId("Navbar-logout-button");
        const jobsLink = screen.queryByTestId("Navbar-jobs");
        const messagesLink = screen.queryByTestId("Navbar-messages");
        const loginLink = screen.queryByTestId("Navbar-login");
        const signupLink = screen.queryByTestId("Navbar-signup");

        // token context not being an empty string results in 'Dashboard' link render
        expect(taskerLink).not.toBeInTheDocument();
        expect(loginLink).not.toBeInTheDocument();
        expect(signupLink).not.toBeInTheDocument();
        expect(jobsLink).toBeInTheDocument();
        expect(messagesLink).toBeInTheDocument();
        expect(logoutBtn).toBeInTheDocument();
        
    });
});