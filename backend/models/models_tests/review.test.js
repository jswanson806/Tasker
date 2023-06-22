"use strict";

const {
  NotFoundError,
  BadRequestError
} = require("../../expressError.js");
const Review = require("../review.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testReviewIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



//************ Tests ************

describe('finds all reviews made FOR a user', function() {
    test('works', async function() {
        const result = await Review.getForUser(testUserIds[0]);
        expect(result.length).toBe(1);

        const result2 = await Review.getForUser(testUserIds[1]);
        expect(result2.length).toBe(2);

        const result3 = await Review.getForUser(testUserIds[2]);
        expect(result3.length).toBe(1);
    })

    test('works: returns correct data', async function() {
        const result = await Review.getForUser(testUserIds[1]);
        expect(result).toEqual([
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
        ]);
    })

    test('error if invalid user id', async function() {
        try{
            await Review.getForUser(testUserIds[4]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('finds all reviews made BY a user', function() {
    test('works', async function() {
        const result = await Review.getFromUser(testUserIds[0]);
        expect(result.length).toBe(1);

        const result2 = await Review.getFromUser(testUserIds[1]);
        expect(result2.length).toBe(2);

        const result3 = await Review.getFromUser(testUserIds[2]);
        expect(result3.length).toBe(1);
    })

    test('error if invalid user id', async function() {
        try{
            await Review.getFromUser(testUserIds[4]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('creates a new review', function() {
    test('works', async function() {
        const newReviewData = {
            title: 'rt4',
            body: 'rb4',
            stars: 5,
            reviewed_by: testUserIds[0],
            reviewed_for: testUserIds[1]
        }

        const result = await Review.create(newReviewData);
        expect(result).toEqual({
            'title': 'rt4',
            'body': 'rb4',
            'stars': 5,
            'reviewed_by': testUserIds[0],
            'reviewed_for': testUserIds[1]
        })
    })

    test('error if invalid user id being reviewed', async function() {
        const newReviewData = {
            title: 'rt4',
            body: 'rb4',
            stars: 5,
            reviewed_by: testUserIds[0],
            reviewed_for: testUserIds[4]
        }

        try {
            const result = await Review.create(newReviewData);
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    
    })
})

describe('gets average review rating of user', function() {
    test('works', async function() {
        const result = await Review.getAverageRating(testUserIds[1]);
        expect(result).toEqual(1.5)
    })

    test('error if no reviews available for this user', async function() {
        try {
            const result = await Review.getAverageRating(testUserIds[4]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})
