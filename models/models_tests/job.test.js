"use strict";

process.env.NODE_ENV = "test";

const {
  NotFoundError, ExpressError
} = require("../../expressError.js");
const Job = require("../job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  testUserIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



//************ Tests ************

describe('testing job model functions for querying database', function() {
    test('only returns job where status is pending', async function() {

        const result = await Job.getAllAvailableJobs();
        // length of returned result should be 1 to match test data
        expect(result.length).toBe(1);
    })

    test('only returns jobs posted by the current user', async function() {

        const result = await Job.getAllJobsPostedByUser(testUserIds[1]);
        // length of returned result should be 1 to match test data
        expect(result.length).toBe(1);
    })

    test('only returns jobs where status is pending review', async function() {

        const result = await Job.getAllPendingReviewUserJobs(testUserIds[2]);
        // length of returned result should be 1 to match test data
        expect(result.length).toBe(1);
    })

    test('only returns jobs where assigned_to is current user and status is active', async function() {

        const result = await Job.getAllAssignedWorkerJobs(testUserIds[1]);
        // length of returned result should be 1 to match test data
        expect(result.length).toBe(1);
    })

    test('no id passed to getAllAppliedWorkerJobs throws error', async function() {

        try{
            await Job.getAllAppliedWorkerJobs();
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }
    })

    test('works - applicants array is attached', async function() {

        const result = await Job.getAllAppliedWorkerJobs(testUserIds[0]);
        // length of returned result should be 1 to match test data
        expect(result.length).toBe(2);

        // returned result should contain applicants
        expect(result[1]).toEqual({
            "address": "444 j street", 
            "after_image_url": null, 
            "applicants": [testUserIds[0]], 
            "assigned_to": null, 
            "before_image_url": "http://before3.img", 
            "body": "jb4", 
            "end_time": null, 
            "id": expect.any(Number), 
            "payment_due": null, 
            "posted_by": testUserIds[1], 
            "start_time": null, 
            "status": "pending", 
            "title": "j4"})
        
    });

});

describe('find a single job function tests', function() {
    test('returns a single job matching the job ID argument', async function() {
        // query a single job
        const result = await Job.get(testJobIds[0]);

        // expect test job 1 to be returned
        expect(result).toEqual({
            'id': testJobIds[0],
            'title': 'j1', 
            'body': 'jb1', 
            'status': 'complete', 
            'address': '111 j street',
            'posted_by': testUserIds[0], 
            'assigned_to': testUserIds[1], 
            'applicants': [testUserIds[0]], 
            'start_time': `06/01/2023 09:00 AM`, 
            'end_time': `06/01/2023 10:00 AM`, 
            'payment_due': 111.11, 
            'before_image_url': 'http://before1.img', 
            'after_image_url': 'http://after1.img'
        })
    })

    test('error if job not found', async function() {
        // pass invalid id to Job.get
        try {
            const result = await Job.get(testJobIds[4]);
        } catch(err) { // should throw an error
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('create a new job function tests', function() {
    test('creates a new job in the database', async function() {
        // new job data
        const newJobData = {
            title: 'j5', 
            body: 'jb5',  
            address: '555 j street',
            posted_by: testUserIds[0], 
            before_image_url: 'http://before5.img', 
        }
        // call Job.create with expected data
        const result = await Job.create(newJobData);
        // expect the resulting new job data to be returned
        expect(result).toEqual({
            'title': 'j5', 
            'body': 'jb5',
            'id': expect.any(Number),
            'status': 'pending', 
            'address': '555 j street',
            'posted_by': testUserIds[0],
            'before_image_url': 'http://before5.img',
        })
        // query all jobs
        const result2 = await Job.getAllAvailableJobs();
        // result should now be length of 2 (+1 compared to test data)
        expect(result2.length).toBe(2);
    })
})

describe('tests updating a job', function() {
    test('updates a job and returns the updated job', async function() {
        // new data with which to update job
        const updateData = {
            title: 'updatedj1', 
            body: 'updatedjb1',  
            address: '444 update street',
            status: 'active'
        }
        // update job
        const result = await Job.update(testJobIds[0], updateData);
        // expect to return only updated columns and values
        expect(result).toEqual({
            'id': testJobIds[0],
            'posted_by': testUserIds[0],
            'title': 'updatedj1', 
            'body': 'updatedjb1',  
            'address': '444 update street',
            'status': 'active',
            "after_image_url": "http://after1.img",
            "before_image_url": "http://before1.img",
            "end_time": expect.any(Date),
            "start_time": expect.any(Date),
            "payment_due": expect.any(Number),
        })
        // query the job that was just updated
        const result2 = await Job.get(testJobIds[0]);
        // expect it to contain the updated values
        expect(result2).toEqual({
            'id': testJobIds[0],
            'title': 'updatedj1', 
            'body': 'updatedjb1', 
            'status': 'active', 
            'address': '444 update street',
            'posted_by': testUserIds[0], 
            'assigned_to': testUserIds[1], 
            'applicants': [testUserIds[0]], 
            'start_time': `06/01/2023 09:00 AM`, 
            'end_time': `06/01/2023 10:00 AM`, 
            'payment_due': 111.11, 
            'before_image_url': 'http://before1.img', 
            'after_image_url': 'http://after1.img'
        })
    })

    test('error if no job found', async function() {
        const updateData = {
            title: 'updatedj1', 
            body: 'updatedjb1',  
            address: '444 update street',
            status: 'active'
        }
        // call update function with invalid job id
        try {
            const result = await Job.update(testJobIds[4], updateData);
        } catch(err) { // should throw NotFoundError
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('tests removing a job from the database', function() {
    test('removes job from the database', async function() {
        // query all jobs
        const result = await Job.getAllAvailableJobs();
        // expect length of 3 test jobs
        expect(result.length).toBe(1);

        // remove first test job
        await Job.remove(testJobIds[3]);

        // query all jobs again
        const result2 = await Job.getAllAvailableJobs();
        // length should now be 2
        expect(result2.length).toBe(0);

        // try to query first test job by id
        try {
            const result3 = await Job.get(testJobIds[0]);
        } catch(err) { // should throw NotFoundError
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })

    test('error if no job found', async function() {
       
        try {
            // call update function with invalid job id
            await Job.remove(testJobIds[4]);
        } catch(err) { // should throw NotFoundError
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })

})