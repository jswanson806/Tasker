"use strict";

process.env.NODE_ENV = "test"

const request = require("supertest");
const app = require("../../app.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testReviewIds,
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//************ Tests ************

describe('GET route for retrieving reviews FOR single user', () => {
    test('works', async () => {
        expect.assertions(2);
        const resp = await request(app)
            .get(`/reviews/for/${testUserIds[1]}`)
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({ Reviews: [
            { 
                id: testReviewIds[2], 
                title: 'rt3', 
                body: 'rb3', 
                stars: 3 
            },
            { 
                id: testReviewIds[1], 
                title: 'rt2', 
                body: 'rb2', 
                stars: 2 
            },
            { 
                id: testReviewIds[0], 
                title: 'rt1', 
                body: 'rb1', 
                stars: 1 
            }
        ]})
    })
})

describe('GET route for retrieving reviews FROM single user', () => {
    test('works', async () => {
        expect.assertions(2);
        const resp = await request(app)
            .get(`/reviews/from/${testUserIds[0]}`)
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({ Reviews: [
            { 
                id: testReviewIds[2], 
                title: 'rt3', 
                body: 'rb3', 
                stars: 3 
            },
            { 
                id: testReviewIds[1], 
                title: 'rt2', 
                body: 'rb2', 
                stars: 2 
            },
            { 
                id: testReviewIds[0], 
                title: 'rt1', 
                body: 'rb1', 
                stars: 1 
            }
        ]})
    })
})

describe('POST route for creating a new review', () => {
    test('works', async () => {
        expect.assertions(2);
        const newReview = 
            {
                title: 'rt4', 
                body: 'rb4', 
                stars: 4,
                reviewed_for: testUserIds[1],
                reviewed_by: testUserIds[0]
            };

        const resp = await request(app)
            .post(`/reviews/create`)
            .send({review: newReview})
            console.log(resp)
        expect(resp.status).toBe(201);
        expect(resp.body).toEqual({ Message: `Review submitted for user: ${testUserIds[1]}` })
    })

    test('works: inserts correct data', async () => {
        expect.assertions(4);
        const newReview = 
            {
                title: 'rt4', 
                body: 'rb4', 
                stars: 4,
                reviewed_for: testUserIds[1],
                reviewed_by: testUserIds[0]
            };
        
        // insert new review
        const resp = await request(app)
            .post(`/reviews/create`)
            .send({review: newReview})

        expect(resp.status).toBe(201);
        expect(resp.body).toEqual({ Message: `Review submitted for user: ${testUserIds[1]}` })

        // get reviews for test user -> should have newReview data
            const resp2 = await request(app)
            .get(`/reviews/for/${testUserIds[1]}`)

        expect(resp2.status).toBe(200);
        expect(resp2.body).toMatchObject({ Reviews: [
            { 
                title: 'rt4', 
                body: 'rb4', 
                stars: 4 
            },
            { 
                id: testReviewIds[2], 
                title: 'rt3', 
                body: 'rb3', 
                stars: 3 
            },
            { 
                id: testReviewIds[1], 
                title: 'rt2', 
                body: 'rb2', 
                stars: 2 
            },
            { 
                id: testReviewIds[0], 
                title: 'rt1', 
                body: 'rb1', 
                stars: 1 
            }
        ]})
    })

    test('error if invalid schema', async () => {
        expect.assertions(1);
        
        const newReview = 
            { 
                body: 'rb4', 
                stars: 4,
                reviewed_for: testUserIds[1],
                reviewed_by: testUserIds[0]
            };

        const resp = await request(app)
            .post(`/reviews/create`)
            .send({review: newReview})
        
        expect(resp.body).toEqual({
            error: {
              message: [ 'instance.review requires property "title"' ],
              status: 500
            }
          })

    })
    
})