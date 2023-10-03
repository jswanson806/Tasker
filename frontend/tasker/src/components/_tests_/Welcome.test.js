import React from "react";
import { render } from "@testing-library/react";
import Welcome from "../Welcome.js";

describe('smoke and snapshot tests', () => {
    test('renders without crashing', () => {
        render(
            <Welcome />
        )
    })

    test('renders without crashing', () => {
        const {asFragment} = render(
            <Welcome />
        )

        expect(asFragment()).toMatchSnapshot();
    })
})