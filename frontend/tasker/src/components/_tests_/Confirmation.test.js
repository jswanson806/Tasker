import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import Confirmation from '../../components/Confirmation.js';
import TaskerApi from '../../api.js';

const onClose = jest.fn();
const onConfirm = jest.fn();
const updateSingleJob = jest.spyOn(TaskerApi, 'updateSingleJob')

const job = 
        {
            title: 'test title',
            body: 'test body',
            address: 'test address',
            assigned_to: '',
            status: 'pending',
            posted_by: 1,
            before_image_url: 'formData.beforeImage'
        };

describe("createJob form smoke and snapshot tests", () => {

    it("should render without crashing", async () => {

        render(
            <Confirmation targetUserId={1} job={job} onConfirm={onConfirm} onClose={onClose}/>
        );

    });

    it("should match snapshot", async() => {
        let asFragment;

        const {asFragment: fragment} = render(
            <Confirmation targetUserId={1} job={job} onConfirm={onConfirm} onClose={onClose}/>
        );

        asFragment = fragment;

        expect(asFragment()).toMatchSnapshot();
    })
})

describe("createJob form renders correct content", () => {


    it("should match snapshot", async() => {

        const {getByTestId} = render(
            <Confirmation targetUserId={1} job={job} onConfirm={onConfirm} onClose={onClose}/>
        );

        expect(getByTestId("confirmation-confirm-button")).toBeInTheDocument();
        expect(getByTestId("confirmation-cancel-button")).toBeInTheDocument();
    })
})

describe("confirm button calls onConfirm function, which calls assignToJob and updateSingleJob", () => {

    it("should match snapshot", async() => {

        const {getByTestId} = render(
            <Confirmation targetUserId={1} job={job} onConfirm={onConfirm} onClose={onClose}/>
        );
        
        const confirmBtn = getByTestId("confirmation-confirm-button")
        expect(confirmBtn).toBeInTheDocument();
   
        fireEvent.click(confirmBtn);

        expect(onConfirm).toHaveBeenCalled();
    })

})