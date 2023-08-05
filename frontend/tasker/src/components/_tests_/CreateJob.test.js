import React from 'react';
import {act, render, screen, fireEvent} from '@testing-library/react';
import { UserContext } from '../../helpers/UserContext.js';
import TaskerApi from '../../api.js';
import CreateJob from '../CreateJob.js';
import Jobs from '../Jobs.js';

const userValue = { user: '{"id": 1, "email": "test@email.com", "isWorker": false}' };

const createJob = jest.spyOn(TaskerApi, 'createJob')

const toggleCreateJob = jest.fn();

describe("createJob form smoke and snapshot tests", () => {

    it("should render without crashing", async () => {

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <CreateJob toggleCreateJob={toggleCreateJob}/>
            </UserContext.Provider>
        )
        });
    });

    it("should match snapshot", async() => {
        let asFragment;

        await act(async () => {const {asFragment: fragment} = render(
            <UserContext.Provider value={userValue}>
                <CreateJob toggleCreateJob={toggleCreateJob}/>
            </UserContext.Provider>
        )
        asFragment = fragment;
        });

        expect(asFragment()).toMatchSnapshot();
    })
})

describe("Handles form input correctly", () => {

    it('updates form input correctly', async () => {
        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <CreateJob toggleCreateJob={toggleCreateJob}/>
            </UserContext.Provider>
        )
        });

        const titleInput = screen.getByTestId("createJob-form-title-input");
        const bodyInput = screen.getByTestId("createJob-form-body-input");
        const addressInput = screen.getByTestId("createJob-form-address-input")
        fireEvent.change(titleInput, {target: {value: "test title"}});
        fireEvent.change(bodyInput, {target: {value: "test body"}});
        fireEvent.change(addressInput, {target: {value: "test address"}});

        // form input fields should have correct data
        expect(titleInput).toHaveValue("test title");
        expect(bodyInput).toHaveValue("test body");
        expect(addressInput).toHaveValue("test address");

    })

    it('should handle form submission with correct data', async () => {

        let jobInfo = {job: {
            title: 'test title',
            body: 'test body',
            address: 'test address',
            posted_by: 1,
            before_image_url: 'formData.beforeImage'
        }};

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <CreateJob toggleCreateJob={toggleCreateJob}/>
            </UserContext.Provider>
        )
        });

        const titleInput = screen.getByTestId("createJob-form-title-input");
        const bodyInput = screen.getByTestId("createJob-form-body-input");
        const addressInput = screen.getByTestId("createJob-form-address-input")
        fireEvent.change(titleInput, {target: {value: "test title"}});
        fireEvent.change(bodyInput, {target: {value: "test body"}});
        fireEvent.change(addressInput, {target: {value: "test address"}});

        const btn = screen.getByTestId("createJob-form-button");

        // submit the form
        await act(async () => {
            fireEvent.click(btn);
        })
        // should have called the function with correct data
        expect(createJob).toHaveBeenCalledTimes(1);
        expect(createJob).toHaveBeenCalledWith(jobInfo);


    })

    it('should call toggleCreateJob to hide the form after submitting', async () => {

        await act(async () => {render(
            <UserContext.Provider value={userValue}>
                <CreateJob toggleCreateJob={toggleCreateJob}/>
            </UserContext.Provider>
        )
        });

        const titleInput = screen.getByTestId("createJob-form-title-input");
        const bodyInput = screen.getByTestId("createJob-form-body-input");
        const addressInput = screen.getByTestId("createJob-form-address-input")
        fireEvent.change(titleInput, {target: {value: "test title"}});
        fireEvent.change(bodyInput, {target: {value: "test body"}});
        fireEvent.change(addressInput, {target: {value: "test address"}});

        const btn = screen.getByTestId("createJob-form-button");

        // submit the form
        await act(async () => {
            fireEvent.click(btn);
        })

        expect(toggleCreateJob).toHaveBeenCalledTimes(1);

    })

})