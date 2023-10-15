import React from 'react';
import SignUp from '../SignUp.js';
import {act, render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { TokenContext } from '../../helpers/TokenContext.js';
import TaskerApi from '../../api.js';
import { UserContext } from '../../helpers/UserContext.js';

const userValue = { user: '{"id": 1, "email": "test@email.com", "isWorker": true}' };

describe("signup form smoke and snapshot tests", () => {

    it("should render without crashing", async () => {

        await act(async () => {render(
            <MemoryRouter>
                <TokenContext.Provider value={'dummyToken'}>
                    <UserContext.Provider value={userValue}>
                        <SignUp />
                    </UserContext.Provider>
                </TokenContext.Provider>
            </MemoryRouter>
        )
        });
    });

    it("should match snapshot", async() => {
        let asFragment;

        await act(async () => {const {asFragment: fragment} = render(
            <MemoryRouter>
                <TokenContext.Provider value={'dummyToken'}>
                    <UserContext.Provider value={userValue}>
                        <SignUp />
                    </UserContext.Provider>
                </TokenContext.Provider>
            </MemoryRouter>
        )
        asFragment = fragment;
        });

        expect(asFragment()).toMatchSnapshot();
    })
})

describe("Handles form input correctly", () => {

    it('updates form input correctly', async () => {
        await act(async () => {render(
            <MemoryRouter>
                <TokenContext.Provider value={'dummyToken'}>
                    <UserContext.Provider value={userValue}>
                        <SignUp />
                    </UserContext.Provider>
                </TokenContext.Provider>
            </MemoryRouter>
        )
        });

        const emailInput = screen.getByTestId("signup-form-email-input");
        const firstName = screen.getByTestId("signup-form-first-name-input");
        const lastName = screen.getByTestId("signup-form-last-name-input");
        const phone = screen.getByTestId("signup-form-phone-input");
        const password = screen.getByTestId("signup-form-password-input");
        fireEvent.change(emailInput, {target: {value: "test@email.com"}});
        fireEvent.change(firstName, {target: {value: "Testy"}});
        fireEvent.change(lastName, {target: {value: "McTesty"}});
        fireEvent.change(phone, {target: {value: "444-444-4444"}});
        fireEvent.change(password, {target: {value: "Password1"}});
        expect(emailInput).toHaveValue("test@email.com");
        expect(firstName).toHaveValue("Testy");
        expect(lastName).toHaveValue("McTesty");
        expect(phone).toHaveValue("444-444-4444");
        expect(password).toHaveValue("Password1");

    })

    it('should handle form submission', async () => {

        // mock the registerUser and login functions of the api
        const mockRegisterUser = jest.spyOn(TaskerApi, 'registerUser').mockResolvedValue('dummy token');

        const mockLogin = jest.spyOn(TaskerApi, 'login')

        await act(async () => {render(
            <MemoryRouter>
                <TokenContext.Provider value={'dummyToken'}>
                    <UserContext.Provider value={userValue}>
                        <SignUp />
                    </UserContext.Provider>
                </TokenContext.Provider>
            </MemoryRouter>
        )
        });

        const emailInput = screen.getByTestId("signup-form-email-input");
        const firstName = screen.getByTestId("signup-form-first-name-input");
        const lastName = screen.getByTestId("signup-form-last-name-input");
        const phone = screen.getByTestId("signup-form-phone-input");
        const password = screen.getByTestId("signup-form-password-input");
        fireEvent.change(emailInput, {target: {value: "test@email.com"}});
        fireEvent.change(firstName, {target: {value: "Testy"}});
        fireEvent.change(lastName, {target: {value: "McTesty"}});
        fireEvent.change(phone, {target: {value: "444-444-4444"}});
        fireEvent.change(password, {target: {value: "Password1"}});

        const btn = screen.getByTestId("signup-form-button");

        await act(async () => {
            fireEvent.click(btn);
        })

        expect(mockRegisterUser).toHaveBeenCalledWith({user: { 
            email: "test@email.com", 
            first_name: "Testy",
            last_name: "McTesty",
            is_worker: false,
            phone: "444-444-4444",
            password: "Password1"
        }});

        expect(mockLogin).toHaveBeenCalledWith("test@email.com", "Password1")
    })

})