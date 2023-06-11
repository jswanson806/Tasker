"use strict";

const {
  NotFoundError
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

describe('find all jobs', function() {
    test('works', async function() {
        // query all jobs
        const result = await Job.findAll();
        // length of returned result should be 3 to match test data
        expect(result.length).toBe(3);
    })
})

describe('find a single job', function() {
    test('works', async function() {
        // query a single job
        const result = await Job.get(testJobIds[0]);

        // expect test job 1 to be returned
        expect(result).toEqual({
            'id': testJobIds[0],
            'title': 'j1', 
            'body': 'jb1', 
            'status': 'completedj1', 
            'address': '111 j street',
            'postedBy': testUserIds[0], 
            'assignedTo': testUserIds[1], 
            'startTime': `06/01/2023 09:00 AM`, 
            'endTime': `06/01/2023 10:00 AM`, 
            'paymentDue': 111.11, 
            'beforeImage': 'http://before1.img', 
            'afterImage': 'http://after1.img'
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

describe('create a new job', function() {
    test('works', async function() {
        // new job data
        const newJobData = {
            title: 'j4', 
            body: 'jb4',  
            address: '444 j street',
            posted_by: testUserIds[0], 
            before_image_url: 'http://before4.img', 
        }
        // call Job.create with expected data
        const result = await Job.create(newJobData);
        // expect the resulting new job data to be returned
        expect(result).toEqual({
            'title': 'j4', 
            'body': 'jb4', 
            'status': 'posted', 
            'address': '444 j street',
            'postedBy': testUserIds[0],
            'beforeImage': 'http://before4.img',
        })
        // query all jobs
        const result2 = await Job.findAll();
        // result should now be length of 4 (+1 compared to test data)
        expect(result2.length).toBe(4);
    })
})

describe('updates a job', function() {
    test('works', async function() {
        // new data with which to update job
        const updateData = {
            title: 'updatedj1', 
            body: 'updatedjb1',  
            address: '444 update street',
            status: 'accepted'
        }
        // update job
        const result = await Job.update(testJobIds[0], updateData);
        // expect to return only updated columns and values
        expect(result).toEqual({
            'title': 'updatedj1', 
            'body': 'updatedjb1',  
            'address': '444 update street',
            'status': 'accepted'
        })
        // query the job that was just updated
        const result2 = await Job.get(testJobIds[0]);
        // expect it to contain the updated values
        expect(result2).toEqual({
            'id': testJobIds[0],
            'title': 'updatedj1', 
            'body': 'updatedjb1', 
            'status': 'accepted', 
            'address': '444 update street',
            'postedBy': testUserIds[0], 
            'assignedTo': testUserIds[1], 
            'startTime': `06/01/2023 09:00 AM`, 
            'endTime': `06/01/2023 10:00 AM`, 
            'paymentDue': 111.11, 
            'beforeImage': 'http://before1.img', 
            'afterImage': 'http://after1.img'
        })
    })

    test('error if no job found', async function() {
        const updateData = {
            title: 'updatedj1', 
            body: 'updatedjb1',  
            address: '444 update street',
            status: 'accepted'
        }
        // call update function with invalid job id
        try {
            const result = await Job.update(testJobIds[4], updateData);
        } catch(err) { // should throw NotFoundError
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('removes a job', function() {
    test('works', async function() {
        // query all jobs
        const result = await Job.findAll();
        // expect length of 3 test jobs
        expect(result.length).toBe(3);

        // remove first test job
        await Job.remove(testJobIds[0]);

        // query all jobs again
        const result2 = await Job.findAll();
        // length should now be 2
        expect(result2.length).toBe(2);

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