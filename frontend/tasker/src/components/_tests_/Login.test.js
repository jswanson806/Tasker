import React from 'react';
import 'jest-localstorage-mock';
import {act, render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import TaskerApi from '../../api.js';
import Login from '../Login.js';


describe("login form smoke and snapshot tests", () => {

    it("should render without crashing", async () => {

        await act(async () => {render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
        )
        });
    });

    it("should match snapshot", async() => {
        let asFragment;

        await act(async () => {const {asFragment: fragment} = render(
                <MemoryRouter>
                    <Login />
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
                    <Login />
                </MemoryRouter>
        )
        });

        const emailInput = screen.getByTestId("login-form-email-input");
        const password = screen.getByTestId("login-form-password-input");
        fireEvent.change(emailInput, {target: {value: "test@email.com"}});
        fireEvent.change(password, {target: {value: "password"}});

        expect(emailInput).toHaveValue("test@email.com");
        expect(password).toHaveValue("password");

    })

    it('should handle form submission', async () => {

        const mockLogin = jest.spyOn(TaskerApi, 'login')

        await act(async () => {render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
        )
        });

        const emailInput = screen.getByTestId("login-form-email-input");
        const password = screen.getByTestId("login-form-password-input");
        fireEvent.change(emailInput, {target: {value: "test@email.com"}});
        fireEvent.change(password, {target: {value: "password"}});

        const btn = screen.getByTestId("login-form-button");

        await act(async () => {
            fireEvent.click(btn);
        })

        expect(mockLogin).toHaveBeenCalledWith("test@email.com", "password")

    })

})