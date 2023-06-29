"use strict";

process.env.NODE_ENV = "test"
const request = require("supertest");
const app = require("../../app.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
    testUserIds,
    adminToken,
    u1Token,
    u3Token
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//************ Tests ************

describe('GET: /', function() {
    test('works: get all users', async function(){
        expect.assertions(2);
        const resp = await request(app)
            .get(`/users`)
            .set('authorization', `Bearer ${adminToken}`)

        expect(resp.status).toBe(200);

        expect(resp.body).toEqual({"allUsers": [{
            "id": testUserIds[0],
            "email": 'u4@email.com',
            "firstName": 'fn4',
            "lastName": 'ln4',
            "isWorker": false,
            "isAdmin": true,
            "phone": '444-444-4444'
        },
        {
            "id": testUserIds[1],
            "email": 'u5@email.com',
            "firstName": 'fn5',
            "lastName": 'ln5',
            "isWorker": false,
            "isAdmin": false,
            "phone": '555-555-5555'
        },
        {
            "id": testUserIds[2],
            "email": 'u6@email.com',
            "firstName": 'fn6',
            "lastName": 'ln6',
            "isWorker": false,
            "isAdmin": false,
            "phone": '666-666-6666'
        }]});
    })
})

describe('GET: /users/:id', function() {
    test('works: get user by id', async function(){
        expect.assertions(2);
        const id = testUserIds[0];
        
        const resp = await request(app)
            .get(`/users/${id}`)
            .set('authorization', `Bearer ${u1Token}`)

        expect(resp.status).toBe(200);
        
        expect(resp.body).toEqual({"user": {
            "id": testUserIds[0],
            "email": 'u4@email.com',
            "firstName": 'fn4',
            "lastName": 'ln4',
            "isWorker": false,
            "isAdmin": true,
            "phone": '444-444-4444',
            "avgRating": null,
            "applications": []
        }});
    })

    test('works: cannot get user by id if not logged in', async function(){
        expect.assertions(1);
        const id = testUserIds[0];
        
        const resp = await request(app)
            .get(`/users/${id}`)

        expect(resp.status).toBe(500);
        
    })
})

describe('POST: /users/:user_id/apply/:job_id', function() {
    test('works: admin add application to user', async function(){
        expect.assertions(4);

        const user_id = testUserIds[1];
        const job_id = testJobIds[0];

        const resp = await request(app)
            .post(`/users/${user_id}/apply/${job_id}`)
            .set('authorization', `Bearer ${adminToken}`)
            
        expect(resp.status).toBe(201);

        expect(resp.body).toEqual({ Message: `User ${user_id} applied to job ${job_id}` });

        const resp2 = await request(app)
            .get(`/users/${user_id}`)
            .set('authorization', `Bearer ${u1Token}`)
        expect(resp2.status).toBe(200);
        expect(resp2.body).toEqual({"user": {
            "id": testUserIds[1],
            "email": 'u5@email.com',
            "firstName": 'fn5',
            "lastName": 'ln5',
            "isWorker": false,
            "isAdmin": false,
            "phone": '555-555-5555',
            "avgRating": 2,
            "applications": [testJobIds[0], job_id]
        }});
    })

    test('works: correct user add application to user', async function(){
        expect.assertions(1);

        const user_id = testUserIds[1];
        const job_id = testJobIds[0];

        const resp = await request(app)
            .post(`/users/${user_id}/apply/${job_id}`)
            .set('authorization', `Bearer ${u1Token}`)
            
        expect(resp.status).toBe(201);

    })
})


describe('PATCH: /users/update/:id', function() {
    test('works: update a user', async function(){
        expect.assertions(6);

        const user_id = testUserIds[0];

        // ********* current user returned *********
        const resp = await request(app)
            .get(`/users/${user_id}`)
            .set('authorization', `Bearer ${adminToken}`)
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({"user": {
            "id": testUserIds[0],
            "email": 'u4@email.com',
            "firstName": 'fn4',
            "lastName": 'ln4',
            "isWorker": false,
            "isAdmin": true,
            "phone": '444-444-4444',
            "avgRating": null,
            "applications": []
        }});

        // ********* update user *********
        const resp2 = await request(app)
            .patch(`/users/update/${user_id}`)
            .send({user: {id: user_id, first_name: 'updatedFn'}})
            .set('authorization', `Bearer ${adminToken}`)

        const updateRes = {
            email: 'u4@email.com',
            firstName: 'updatedFn',
            lastName: 'ln4',
            phone: '444-444-4444',
            isWorker: false,
            isAdmin: true
        }

        expect(resp2.status).toBe(200);

        expect(resp2.body).toEqual({ Message: `Updated user ${updateRes.id}: ${updateRes}` });

        // ********* verify user returned has updates *********
        const resp3 = await request(app)
            .get(`/users/${user_id}`)
            .set('authorization', `Bearer ${adminToken}`)
        expect(resp3.status).toBe(200);
        expect(resp3.body).toEqual({"user": {
            "id": testUserIds[0],
            "email": 'u4@email.com',
            "firstName": 'updatedFn',
            "lastName": 'ln4',
            "isWorker": false,
            "isAdmin": true,
            "phone": '444-444-4444',
            "avgRating": null,
            "applications": []
        }});
    })
})

describe('DELETE: /users/:id', function() {
    test('works: admin can delete a user', async function(){
        expect.assertions(4);

        const user_id = testUserIds[0];

        // ********* remove user *********
        const resp = await request(app)
            .delete(`/users/remove/${user_id}`)
            .set('authorization', `Bearer ${adminToken}`)

        expect(resp.status).toBe(201);

        expect(resp.body).toEqual({ Message: `User ${user_id} has been removed` });

        // ********* verify all users does not include removed user *********
        const resp2 = await request(app)
            .get(`/users`)
            .set('authorization', `Bearer ${adminToken}`)

        expect(resp2.status).toBe(200);

        expect(resp2.body).toEqual({"allUsers": [
        {
            "id": testUserIds[1],
            "email": 'u5@email.com',
            "firstName": 'fn5',
            "lastName": 'ln5',
            "isWorker": false,
            "isAdmin": false,
            "phone": '555-555-5555'
        },
        {
            "id": testUserIds[2],
            "email": 'u6@email.com',
            "firstName": 'fn6',
            "lastName": 'ln6',
            "isWorker": false,
            "isAdmin": false,
            "phone": '666-666-6666'
        }]});
    })

    test('works: error if not admin', async function(){
        expect.assertions(1);

        const user_id = testUserIds[0];

        // ********* remove user *********
        const resp = await request(app)
            .delete(`/users/remove/${user_id}`)
            .set('authorization', `Bearer ${u3Token}`)

        expect(resp.status).toBe(500);

    })
})