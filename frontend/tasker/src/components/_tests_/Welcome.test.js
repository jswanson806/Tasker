import React from "react";
import { render } from "@testing-library/react";
import Welcome from "../Welcome.js";
import { MemoryRouter } from "react-router-dom";

describe('smoke and snapshot tests', () => {
    test('renders without crashing', () => {
        render(
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        )
    })

    test('renders without crashing', () => {
        const {asFragment} = render(
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        )

        expect(asFragment()).toMatchSnapshot();
    })
})