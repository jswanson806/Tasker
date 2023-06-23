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
    testPayoutIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ******** Tests ********

describe('GET route for retrieving payouts FOR a single user', () => {
    test('works', async () => {
        expect.assertions(2);

        const result = await request(app)
            .get(`/payouts/for/${testUserIds[0]}`);

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({ payouts: [
            {
                id: testPayoutIds[2],
                subtotal: 40.00,
                tax: 1.00,
                tip: 4.00,
                total: 45.00
            },
            {
                id: testPayoutIds[1],
                subtotal: 60.00,
                tax: 3.00,
                tip: 6.00,
                total: 69.00
            },
            {
                id: testPayoutIds[0],
                subtotal: 50.00,
                tax: 2.00,
                tip: 5.00,
                total: 57.00
            }
        ]});

     });
})

describe('GET route for retrieving payouts FROM a single user', () => {
    test('works', async () => {
        expect.assertions(2);

        const result = await request(app)
            .get(`/payouts/from/${testUserIds[1]}`);

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({ payouts: [
            {
                id: testPayoutIds[2],
                subtotal: 40.00,
                tax: 1.00,
                tip: 4.00,
                total: 45.00
            },
            {
                id: testPayoutIds[1],
                subtotal: 60.00,
                tax: 3.00,
                tip: 6.00,
                total: 69.00
            },
            {
                id: testPayoutIds[0],
                subtotal: 50.00,
                tax: 2.00,
                tip: 5.00,
                total: 57.00
            }
        ]});

     });
});

describe('POST route for creating a new payout', () => {
    test('works', async () => {
        expect.assertions(6);

        // check length of payouts returned from user -> should be 3
        const result = await request(app)
            .get(`/payouts/from/${testUserIds[1]}`);

        expect(result.status).toBe(200);
        expect(result.body.payouts.length).toBe(3);

        // new payout data
        const payout = { payout: {
            trans_to: testUserIds[0],
            trans_by: testUserIds[1],
            subtotal: 70.00,
            tax: 5.00,
            tip: 5.00,
            total: 80.00
        } };

        // post request to create route
        const result2 = await request(app)
            .post(`/payouts/create`)
            .send(payout);

            expect(result2.status).toBe(201);
            expect(result2.body).toEqual({ Message: `Created new payout for user: ${testUserIds[0]}`})

        // check length of payouts returned from user -> should now be 4
        const result3 = await request(app)
            .get(`/payouts/from/${testUserIds[1]}`);

        expect(result3.status).toBe(200);
        expect(result3.body.payouts.length).toBe(4);
     })

    test('works: adds correct data', async () => {
        expect.assertions(6);

        // check length of payouts returned from user -> should be 3
        const result = await request(app)
            .get(`/payouts/from/${testUserIds[1]}`);

        expect(result.status).toBe(200);
        expect(result.body.payouts.length).toBe(3);

        // new payout data
        const payout = { payout: {
            trans_to: testUserIds[0],
            trans_by: testUserIds[1],
            subtotal: 70.00,
            tax: 5.00,
            tip: 5.00,
            total: 80.00
        } };

        // post request to create route
        const result2 = await request(app)
            .post(`/payouts/create`)
            .send(payout);

        expect(result2.status).toBe(201);
        expect(result2.body).toEqual({ Message: `Created new payout for user: ${testUserIds[0]}`})

        // check data returned from user -> should contain new payout data
        const result3 = await request(app)
            .get(`/payouts/from/${testUserIds[1]}`);

        expect(result3.status).toBe(200);
        expect(result3.body).toMatchObject({ payouts: [
            {
                subtotal: 70.00,
                tax: 5.00,
                tip: 5.00,
                total: 80.00
            },
            {
                id: testPayoutIds[2],
                subtotal: 40.00,
                tax: 1.00,
                tip: 4.00,
                total: 45.00
            },
            {
                id: testPayoutIds[1],
                subtotal: 60.00,
                tax: 3.00,
                tip: 6.00,
                total: 69.00
            },
            {
                id: testPayoutIds[0],
                subtotal: 50.00,
                tax: 2.00,
                tip: 5.00,
                total: 57.00
            }
        ]});
     })

    test('works: error if invalid schema', async () => {
        expect.assertions(1);

        // new payout data -> missing trans_to property
        const payout = { payout: {
            trans_by: testUserIds[1],
            subtotal: 70.00,
            tax: 5.00,
            tip: 5.00,
            total: 80.00
        } };

        // post request to create route
        const result = await request(app)
        .post(`/payouts/create`)
        .send(payout);

        expect(result.body).toEqual({
            error: {
              message: [ 'instance.payout requires property "trans_to"' ],
              status: 500
            }
          });
        
    })
})