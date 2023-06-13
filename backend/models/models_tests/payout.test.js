"use strict";

const { NotFoundError } = require("../../expressError.js");
const Payout = require("../payout.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


//************ Tests ************

describe('get all payouts FOR single user', function() {
    test('works', async function() {
        const result = await Payout.getFor(testUserIds[0]);
        expect(result.length).toBe(3);
    })

    test('error if user not found', async function() {
        try {
            await Payout.getFor(testUserIds[4]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
        
    })

    test('error if no payouts for user found', async function() {
        try {
            await Payout.getFor(testUserIds[1]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
        
    })
})

describe('get all payouts FROM single user', function() {
    test('works', async function() {
        const result = await Payout.getFrom(testUserIds[1]);
        expect(result.length).toBe(3);
    })

    test('error if user not found', async function() {
        try {
            await Payout.getFrom(testUserIds[4]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
        
    })

    test('error if no payouts from user found', async function() {
        try {
            await Payout.getFrom(testUserIds[1]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
        
    })
})

describe('create new payout for user', function() {
    test('works', async function() {
        // new payout data
        const newPayoutData = {
            trans_to: testUserIds[1],
            trans_by: testUserIds[0],
            subtotal: 100.00,
            tax: 8.00,
            tip: 10.00,
            total: 118.00
        }
        // create new payout with newPayoutData
        const result = await Payout.create(newPayoutData);
        // toMatchObject to exclude timestamp from result
        expect(result).toMatchObject({
            trans_to: testUserIds[1],
            trans_by: testUserIds[0],
            subtotal: 100.00,
            tax: 8.00,
            tip: 10.00,
            total: 118.00
        })
    })

    test('error if invalid user', async function() {
        // new payout data
        const newPayoutData = {
            trans_to: 1,
            trans_by: 2,
            subtotal: 100.00,
            tax: 8.00,
            tip: 10.00,
            total: 118.00
        }

        try {
            // create new payout with newPayoutData
            await Payout.create(newPayoutData);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })

})