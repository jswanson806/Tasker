import React from "react";
import JobCompletionForm from "../JobCompletionForm";
import {act, render, screen, fireEvent, waitFor} from '@testing-library/react';
import TaskerApi from "../../api";

const job = {
    id: 1, 
    title: 'testing jobs 1', 
    body: 'job 1 body for testing the job card', 
    postedBy: 1, 
    status: 'active',
    start_time: '2023-10-03 09:00:00 AM',
    applicants: []
}

const onUpload = jest.fn();
const updateSingleJob = jest.spyOn(TaskerApi, 'updateSingleJob');
const uploadAfterImage = jest.spyOn(TaskerApi, 'uploadAfterImage');

describe("JobCompletionForm smoke and snapshot tests", () => {

    it("should render without crashing", async () => {

        await act(async () => {render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )

        });
    });

    it("should match snapshot", async() => {
        let asFragment;

        await act(async () => {const {asFragment: fragment} = render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )
        asFragment = fragment;
        });

        expect(asFragment()).toMatchSnapshot();
    })
})


describe("handles form submission correctly", () => {

    it("should render without crashing", async () => {

        await act(async () => {render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )

        });
    });

    it("should match snapshot", async() => {
        let asFragment;

        await act(async () => {const {asFragment: fragment} = render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )
        asFragment = fragment;
        });

        expect(asFragment()).toMatchSnapshot();
    });
});


describe("Handles file upload correctly", () => {

    it('handles valid file upload', async () => {
        await act(async () => {render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )
        });

        const inputElement = screen.getByTestId('image-input');
      
        // fake file
        const fakeFile = new File(['fake image content'], 'fake-image.png', {
          type: 'image/png',
        });
      
        // Simulate a file change event
        fireEvent.change(inputElement, { target: { files: [fakeFile] } });
      
        // input is valid 
        expect(inputElement).toBeValid();

    });

    it('handles invalid file upload', async () => {
        await act(async () => {render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )
        });

        const inputElement = screen.getByTestId('image-input');
      
        // fake file
        const fakeFile = new File(['fake video content'], 'fake-video.mpg', {
          type: 'video/mpg',
        });
      
        // Simulate a file change event
        fireEvent.change(inputElement, { target: { files: [fakeFile] } });
      
        // input is not valid 
        expect(inputElement).not.toBeValid();

    });

});

describe("Handles form submission correctly", () => {

    it('should create job update and call api upon submit with correct data', async () => {
        await act(async () => {render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )
        });

        const inputElement = screen.getByTestId('image-input');
      
        // fake file
        const fakeFile = new File(['fake image content'], 'fake-image.png', {
          type: 'image/png',
        });
      
        // Simulate a file change event
        fireEvent.change(inputElement, { target: { files: [fakeFile] } });
      
        // input is valid 
        expect(inputElement).toBeValid();

        const submitBtn = screen.getByTestId("jobCompletion-submit-button");

        fireEvent.click(submitBtn)

        expect(updateSingleJob).toHaveBeenCalledTimes(1);
        expect(updateSingleJob).toHaveBeenCalledWith({ job: 
            {
                id: 1, 
                title: 'testing jobs 1', 
                body: 'job 1 body for testing the job card', 
                postedBy: 1, 
                status: 'pending review',
                start_time: '2023-10-03 09:00:00 AM',
                end_time: expect.any(String),
                after_image_url: 'fake-image.png',
                payment_due: expect.any(Number),
                applicants: []
            }
        });

    });

    it('should call api to upload after image upon submit', async () => {
        await act(async () => {render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )
        });

        const inputElement = screen.getByTestId('image-input');
      
        // fake file
        const fakeFile = new File(['fake image content'], 'fake-image.png', {
          type: 'image/png',
        });
      
        // Simulate a file change event
        fireEvent.change(inputElement, { target: { files: [fakeFile] } });
      
        // input is valid 
        expect(inputElement).toBeValid();

        const submitBtn = screen.getByTestId("jobCompletion-submit-button");

        fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(uploadAfterImage).toHaveBeenCalledTimes(1);
        })
        

    });

    it('should call onUpload upon submit', async () => {
        await act(async () => {render(
            <JobCompletionForm job={job} onUpload={onUpload}/>
        )
        });

        const inputElement = screen.getByTestId('image-input');
      
        // fake file
        const fakeFile = new File(['fake image content'], 'fake-image.png', {
          type: 'image/png',
        });
      
        // Simulate a file change event
        fireEvent.change(inputElement, { target: { files: [fakeFile] } });
      
        // input is valid 
        expect(inputElement).toBeValid();

        const submitBtn = screen.getByTestId("jobCompletion-submit-button");

        fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(onUpload).toHaveBeenCalledTimes(1);
        })
        

    });


});